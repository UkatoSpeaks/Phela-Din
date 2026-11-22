"use client";

import { useState } from "react";
import { AiFeedbackResponseSchema, type AiAnswer, type AiTaskScene as AiTaskSceneType } from "@/types/simulation";
import { Button } from "@/components/ui/Button";
import { SceneCard } from "./SceneCard";

interface Props {
  scene: AiTaskSceneType;
  simulationId: string;
  /** Called when the player continues after seeing feedback. */
  onDone: (answer: AiAnswer) => void;
}

type State =
  | { status: "writing"; error?: string }
  | { status: "submitting" }
  | { status: "reviewed"; feedback: string; score: number };

export function AiTaskScene({ scene, simulationId, onDone }: Props) {
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<State>({ status: "writing" });

  async function submit() {
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulationId, sceneId: scene.id, answer }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = AiFeedbackResponseSchema.parse(await res.json());
      setState({ status: "reviewed", ...data });
    } catch (e) {
      console.error(e);
      setState({ status: "writing", error: "Couldn't get feedback right now. Check your connection and try again." });
    }
  }

  const trimmed = answer.trim();

  return (
    <SceneCard scene={scene}>
      <label htmlFor={`answer-${scene.id}`} className="sr-only">
        Your answer
      </label>
      <textarea
        id={`answer-${scene.id}`}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={scene.placeholder}
        disabled={state.status !== "writing"}
        rows={5}
        maxLength={2000}
        className="w-full rounded-2xl border-2 border-line bg-cream p-4 text-base outline-none focus:border-saffron disabled:opacity-70"
      />

      {state.status === "writing" && state.error ? <p className="text-sm text-terracotta">{state.error}</p> : null}

      {state.status === "reviewed" ? (
        <div className="animate-fade-up rounded-2xl bg-leaf/10 p-4">
          <p className="text-sm font-semibold text-leaf">Feedback · {state.score}/10</p>
          <p className="mt-1">{state.feedback}</p>
        </div>
      ) : null}

      {state.status === "reviewed" ? (
        <Button onClick={() => onDone({ answer: trimmed, feedback: state.feedback, score: state.score })}>
          Continue
        </Button>
      ) : (
        <Button onClick={submit} disabled={trimmed.length === 0 || state.status === "submitting"}>
          {state.status === "submitting" ? "Checking…" : "Submit"}
        </Button>
      )}
    </SceneCard>
  );
}
