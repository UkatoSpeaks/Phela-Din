"use client";

import { useState } from "react";
import { Tiffin, type TiffinReactionCue } from "@/components/sim/Tiffin";
import { deriveMood, type TiffinMood, type TiffinReaction } from "@/lib/tiffin";
import type { MeterKey, Meters } from "@/types/simulation";

const MOODS: TiffinMood[] = ["idle", "steaming", "sleepy"];
const REACTIONS: TiffinReaction[] = ["happy", "wince", "shocked"];

const SLIDERS: { key: MeterKey; label: string; maps: string }[] = [
  { key: "energy", label: "Energy", maps: "food level" },
  { key: "stress", label: "Stress", maps: "steam + rattle" },
  { key: "satisfaction", label: "Satisfaction", maps: "warm glow" },
];

/** /design playground: trigger every state and drive the three meters. */
export function TiffinDemo() {
  const [meters, setMeters] = useState<Meters>({ energy: 70, stress: 30, satisfaction: 55 });
  const [mood, setMood] = useState<TiffinMood | undefined>(undefined);
  const [cue, setCue] = useState<TiffinReactionCue | null>(null);

  const chip = (active: boolean) =>
    `min-h-11 rounded-[var(--radius-control)] border-2 px-3 text-sm font-bold capitalize transition ${
      active ? "border-ink bg-ink text-sheet" : "border-ink/30 bg-sheet hover:border-ink"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-paper)] bg-sheet py-10 shadow-[var(--shadow-paper)]">
        <Tiffin meters={meters} mood={mood} reaction={cue} size={180} />
        <p className="mt-10 text-sm text-ink-2">
          Showing: <span className="font-bold text-ink">{cue ? "reaction, then " : ""}{mood ?? `${deriveMood(meters)} (from meters)`}</span>. Tap
          Tiffin for values.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Mood (sustained)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className={chip(mood === undefined)} onClick={() => setMood(undefined)} aria-pressed={mood === undefined}>
              From meters
            </button>
            {MOODS.map((m) => (
              <button key={m} type="button" className={chip(mood === m)} onClick={() => setMood(m)} aria-pressed={mood === m}>
                {m}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Reaction (under 600ms)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REACTIONS.map((r) => (
              <button key={r} type="button" className={chip(false)} onClick={() => setCue({ type: r, key: Date.now() })}>
                {r}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Meters</legend>
          {SLIDERS.map((s) => (
            <label key={s.key} className="block">
              <span className="flex items-baseline justify-between text-sm">
                <span>
                  <span className="font-bold">{s.label}</span> <span className="text-ink-2">→ {s.maps}</span>
                </span>
                <span className="font-bold tabular-nums">{meters[s.key]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={meters[s.key]}
                onChange={(e) => setMeters((m) => ({ ...m, [s.key]: Number(e.target.value) }))}
                className="mt-1 h-11 w-full cursor-pointer accent-[var(--color-ink)]"
              />
            </label>
          ))}
        </fieldset>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Sizes · readable at 64px</p>
          <div className="mt-2 flex items-end gap-4">
            {[64, 96, 128].map((px) => (
              <div key={px} className="flex flex-col items-center gap-1">
                <Tiffin meters={meters} mood={mood} reaction={cue} size={px} readout="none" />
                <span className="text-xs tabular-nums text-ink-2">{px}px</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
