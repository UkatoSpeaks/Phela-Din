"use client";

/**
 * The simulation player. Owns the Run state, delegates all game logic to
 * lib/engine (pure functions), persists every change to localStorage, and
 * renders the right component for the current phase/scene.
 */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import {
  applyChoice,
  completeEvent,
  getCurrentDay,
  getCurrentScene,
  getProgress,
  nextStep,
  startRun,
  submitAiTask,
} from "@/lib/engine";
import { buildFitReport } from "@/lib/fit-report";
import { clearRun, loadRun, saveRun } from "@/lib/storage";
import { METER_KEYS, type AiAnswer, type MeterEffects, type Run, type Simulation } from "@/types/simulation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { AiTaskScene } from "./AiTaskScene";
import { ChoiceButton } from "./ChoiceButton";
import { DayIntro } from "./DayIntro";
import { MeterBar } from "./MeterBar";
import { SceneCard } from "./SceneCard";

const METER_LABELS = { energy: "Energy", stress: "Stress", satisfaction: "Satisfaction" } as const;

function EffectChips({ effects }: { effects: MeterEffects }) {
  const entries = METER_KEYS.filter((k) => effects[k]).map((k) => [k, effects[k] ?? 0] as const);
  if (entries.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {entries.map(([key, delta]) => {
        // For stress, going up is bad; for the others, going up is good.
        const good = key === "stress" ? delta < 0 : delta > 0;
        return (
          <span
            key={key}
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${good ? "bg-leaf/15 text-leaf" : "bg-terracotta/15 text-terracotta"}`}
          >
            {METER_LABELS[key]} {delta > 0 ? "+" : "−"}
            {Math.abs(delta)}
          </span>
        );
      })}
    </div>
  );
}

/** A saved run is only resumable if it still points at a real scene in the current content. */
function isResumable(sim: Simulation, run: Run): boolean {
  return run.status === "finished" || getCurrentScene(sim, run) !== undefined;
}

export function SimPlayer({ sim }: { sim: Simulation }) {
  const router = useRouter();
  const [run, setRun] = useState<Run | null>(null);
  const started = useRef(false);

  // Load (or start) the run on the client only, since localStorage doesn't exist during SSR.
  useEffect(() => {
    if (started.current) return; // avoid double-start under React StrictMode in dev
    started.current = true;

    const saved = loadRun(sim.id);
    if (saved && isResumable(sim, saved)) {
      setRun(saved);
      if (saved.status === "in_progress") track("sim_started", { simulationId: sim.id, resumed: true });
      return;
    }
    const fresh = startRun(sim);
    saveRun(fresh);
    setRun(fresh);
    track("sim_started", { simulationId: sim.id, resumed: false });
  }, [sim]);

  if (!run) {
    return <p className="py-20 text-center text-muted">Loading…</p>;
  }

  /** Every state change goes through here: persist first, then render. */
  function update(next: Run) {
    saveRun(next);
    setRun(next);
    if (next.status === "finished") {
      const durationSeconds = Math.round((Date.now() - new Date(next.startedAt).getTime()) / 1000);
      track("sim_completed", { simulationId: sim.id, verdict: buildFitReport(next).verdict, durationSeconds });
      router.push(`/sim/${sim.id}/result`);
    }
  }

  function restart() {
    if (!window.confirm("Start this career again from Day 1? Your progress will be lost.")) return;
    clearRun(sim.id);
    const fresh = startRun(sim);
    update(fresh);
    track("sim_started", { simulationId: sim.id, resumed: false });
  }

  // ---- Finished (e.g. came back to a completed sim) -------------------------
  if (run.status === "finished") {
    return (
      <div className="flex flex-col gap-4 py-10 text-center">
        <h1 className="text-2xl font-extrabold">You&apos;ve finished {sim.title}</h1>
        <ButtonLink href={`/sim/${sim.id}/result`}>See your Fit Report</ButtonLink>
        <Button variant="secondary" onClick={restart}>
          Play again
        </Button>
      </div>
    );
  }

  const day = getCurrentDay(sim, run);
  const scene = getCurrentScene(sim, run);
  const progress = getProgress(sim, run);
  if (!day || !scene) return null; // unreachable for a valid run

  const dayNumber = day.day;

  function onChoose(choiceIndex: number) {
    if (!run || !scene) return;
    update(applyChoice(sim, run, scene.id, choiceIndex));
    track("scene_completed", { simulationId: sim.id, sceneId: scene.id, sceneType: "choice", day: dayNumber, choiceIndex });
  }

  function onEventContinue() {
    if (!run || !scene) return;
    update(completeEvent(sim, run, scene.id));
    track("scene_completed", { simulationId: sim.id, sceneId: scene.id, sceneType: "event", day: dayNumber });
  }

  function onAiTaskDone(answer: AiAnswer) {
    if (!run || !scene) return;
    track("ai_task_submitted", {
      simulationId: sim.id,
      sceneId: scene.id,
      answerLength: answer.answer.length,
      score: answer.score,
    });
    update(submitAiTask(sim, run, scene.id, answer));
    track("scene_completed", { simulationId: sim.id, sceneId: scene.id, sceneType: "ai_task", day: dayNumber });
  }

  function onContinue() {
    if (!run) return;
    update(nextStep(sim, run));
  }

  // ---- Body by phase --------------------------------------------------------
  let body: React.ReactNode;

  if (run.phase === "day_intro") {
    body = <DayIntro key={`day-${day.day}`} day={day} totalDays={sim.days.length} onStart={onContinue} />;
  } else if (scene.type === "choice") {
    const picked = run.phase === "outcome" ? run.choices[scene.id] : undefined;
    const pickedChoice = picked !== undefined ? scene.choices[picked] : undefined;
    body = (
      <SceneCard key={scene.id} scene={scene}>
        {scene.choices.map((choice, i) => (
          <ChoiceButton
            key={i}
            text={choice.text}
            onClick={() => onChoose(i)}
            disabled={picked !== undefined}
            selected={picked === i}
          />
        ))}
        {pickedChoice ? (
          <div className="animate-fade-up rounded-2xl bg-cream p-4">
            <p>{pickedChoice.outcome}</p>
            <EffectChips effects={pickedChoice.effects} />
            <Button className="mt-4 w-full" onClick={onContinue}>
              Continue
            </Button>
          </div>
        ) : null}
      </SceneCard>
    );
  } else if (scene.type === "event") {
    body = (
      <SceneCard key={scene.id} scene={scene}>
        {scene.effects ? <EffectChips effects={scene.effects} /> : null}
        <Button onClick={onEventContinue}>Continue</Button>
      </SceneCard>
    );
  } else {
    body = <AiTaskScene key={scene.id} scene={scene} simulationId={sim.id} onDone={onAiTaskDone} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold leading-tight">{sim.title}</h1>
          <p className="text-xs text-muted">
            Day {day.day} of {sim.days.length} · {progress.completed}/{progress.total} moments
          </p>
        </div>
        <button type="button" onClick={restart} className="min-h-11 px-2 text-sm text-muted underline-offset-4 hover:underline">
          Restart
        </button>
      </header>
      <div className="sticky top-2 z-10">
        <MeterBar meters={run.meters} />
      </div>
      {body}
    </div>
  );
}
