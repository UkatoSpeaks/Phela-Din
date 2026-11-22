"use client";

/**
 * "How it works", told as one working day: 9:30 AM → 3:00 PM → 6:45 PM.
 * The 3:00 PM step is a real, playable scene from the sample simulation,
 * so visitors understand the product by doing it. ScrollTrigger draws the
 * day's rail as you scroll; under reduced motion everything is just there.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { Tiffin, type TiffinReactionCue } from "@/components/sim/Tiffin";
import { ButtonLink } from "@/components/ui/Button";
import { PaperCard } from "@/components/ui/PaperCard";
import { Stamp } from "@/components/ui/Stamp";
import { StickyNote } from "@/components/ui/StickyNote";
import { applyEffects } from "@/lib/engine";
import { reactionForEffects } from "@/lib/tiffin";
import { METER_KEYS, type ChoiceScene, type MeterEffects, type Meters } from "@/types/simulation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LABEL = { energy: "Energy", stress: "Stress", satisfaction: "Satisfaction" } as const;

function Chips({ effects }: { effects: MeterEffects }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {METER_KEYS.filter((k) => effects[k]).map((k) => {
        const d = effects[k] ?? 0;
        const good = k === "stress" ? d < 0 : d > 0;
        return (
          <span key={k} className={`rounded-[3px] border px-1.5 py-0.5 text-xs font-bold tabular-nums ${good ? "border-leaf-deep/40 text-leaf-deep" : "border-margin-deep/40 text-margin-deep"}`}>
            {LABEL[k]} {d > 0 ? "+" : "−"}
            {Math.abs(d)}
          </span>
        );
      })}
    </div>
  );
}

function MiniScene({ scene, initialMeters, simId }: { scene: ChoiceScene; initialMeters: Meters; simId: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [meters, setMeters] = useState(initialMeters);
  const [cue, setCue] = useState<TiffinReactionCue | null>(null);
  const choice = picked === null ? null : scene.choices[picked];

  function choose(i: number) {
    const c = scene.choices[i];
    if (!c || picked !== null) return;
    setPicked(i);
    setMeters((m) => applyEffects(m, c.effects));
    const type = reactionForEffects(c.effects);
    if (type) setCue((q) => ({ type, key: (q?.key ?? 0) + 1 }));
  }

  function reset() {
    setPicked(null);
    setMeters(initialMeters);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-[var(--radius-control)] border-2 border-dashed border-ink/30 px-3 py-2">
        <Tiffin meters={meters} reaction={cue} size={60} readout="right" />
        <p className="text-sm leading-snug text-ink-2">
          This is <span className="font-bold text-ink">Tiffin</span>. Food = energy, steam = stress, glow = satisfaction. Tap it for the numbers.
        </p>
      </div>

      <PaperCard variant="ledger" className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-2">{scene.time} · Try it</p>
        <p className="font-medium">{scene.text}</p>
        <div className="mt-3 flex flex-col gap-2 pb-1">
          {scene.choices.map((c, i) => {
            const isPicked = picked === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={picked !== null && !isPicked}
                aria-pressed={isPicked}
                className={`min-h-12 rounded-[var(--radius-control)] border-2 px-4 py-2 text-left font-bold leading-snug transition ${
                  isPicked ? "border-ink bg-haldi/40" : picked !== null ? "border-ink/15 text-ink-2 opacity-60" : "border-ink bg-sheet shadow-[0_3px_0_0_var(--color-ink)] active:translate-y-[3px] active:shadow-none"
                }`}
              >
                {c.text}
              </button>
            );
          })}
        </div>
        {choice ? (
          <>
            <div className="pointer-events-none absolute -right-1 top-1">
              <Stamp key={picked} label="Decided" sub={scene.time} rotate={8} size="sm" animate />
            </div>
            <div className="mt-2 animate-slide border-t border-dashed border-ink/30 pt-2">
              {choice.outcome ? <p className="font-medium">{choice.outcome}</p> : null}
              <div className="mt-2">
                <Chips effects={choice.effects} />
              </div>
            </div>
          </>
        ) : null}
      </PaperCard>

      {choice ? (
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={`/sim/${simId}`} prefetch={false}>
            Play the full week
          </ButtonLink>
          <button type="button" onClick={reset} className="min-h-11 px-2 font-bold underline decoration-chai decoration-2 underline-offset-4">
            Try the other choice
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ReportPreview() {
  const traits = [
    { label: "Organised", pct: 38 },
    { label: "People", pct: 25 },
    { label: "Communication", pct: 19 },
  ];
  return (
    <PaperCard className="relative">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Example · Fit Report</p>
      <p className="mt-1 font-display text-xl font-semibold">Appraisal: Office Associate (sample)</p>
      <ul className="mt-3 space-y-2">
        {traits.map((t) => (
          <li key={t.label}>
            <div className="flex justify-between text-sm font-bold">
              <span>{t.label}</span>
              <span className="tabular-nums text-ink-2">{t.pct}%</span>
            </div>
            <div className="mt-1 h-2 bg-paper-2">
              <div className="h-full bg-ink" style={{ width: `${t.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        Verdict: <span className="font-bold">worth exploring</span>. Talk to people in this job before deciding.
      </p>
      <div className="pointer-events-none absolute -top-3 right-2">
        <Stamp label="Worth exploring" tone="stamp" rotate={7} size="sm" />
      </div>
    </PaperCard>
  );
}

interface Props {
  demoScene: ChoiceScene;
  initialMeters: Meters;
  simId: string;
}

export function HowItWorks({ demoScene, initialMeters, simId }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hw-rail-fill",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", transformOrigin: "top", scrollTrigger: { trigger: ".hw-steps", start: "top 75%", end: "bottom 60%", scrub: 0.4 } },
        );
        gsap.utils.toArray<HTMLElement>(".hw-step").forEach((step) => {
          gsap.fromTo(step, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: step, start: "top 82%" } });
          const dot = step.querySelector(".hw-dot");
          if (dot) gsap.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)", scrollTrigger: { trigger: step, start: "top 78%" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const steps = [
    {
      time: "9:30 AM",
      title: "Pick a job and walk in",
      body: "Choose a career. Each day starts with a note from someone who actually does the job, so you know what you're walking into.",
      extra: (
        <StickyNote label="Example note" from="a mentor" rotate={-1.5} className="max-w-xs">
          Nobody tells you how much of the job is just keeping track of things.
        </StickyNote>
      ),
    },
    {
      time: "3:00 PM",
      title: "Make the calls",
      body: "Real situations with no right answers. Every choice changes your energy, stress and satisfaction. Try one:",
      extra: <MiniScene scene={demoScene} initialMeters={initialMeters} simId={simId} />,
    },
    {
      time: "6:45 PM",
      title: "Get an honest Fit Report",
      body: "At the end of the week: what drained you, what you enjoyed, and whether this career is worth a closer look.",
      extra: <ReportPreview />,
    },
  ];

  return (
    <section ref={root} aria-labelledby="hw-title" className="mx-auto w-full min-w-0 max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-2">How it works</p>
      <h2 id="hw-title" className="mt-1 max-w-[18ch] text-[32px] font-semibold leading-[1.1] sm:text-[44px]">
        One working day, three moments.
      </h2>

      <ol className="hw-steps relative mt-8">
        {/* the day's rail */}
        <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-[3px] bg-ink/15" />
        <span aria-hidden className="hw-rail-fill absolute bottom-2 left-[7px] top-2 w-[3px] bg-ink" />
        {steps.map((s) => (
          <li key={s.time} className="hw-step relative pb-12 pl-9 last:pb-0">
            <span aria-hidden className="hw-dot absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full border-[3px] border-ink bg-haldi" />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
              <div>
                <p className="font-display text-sm font-bold tabular-nums tracking-[0.06em] text-chai-deep">{s.time}</p>
                <h3 className="mt-1 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-prose text-ink-2">{s.body}</p>
              </div>
              <div>{s.extra}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
