"use client";

import { StickyNote } from "@/components/ui/StickyNote";
import { useTake } from "./TakeProvider";

const TONES = ["haldi", "rose", "sky"] as const;

/** Each research moment as a sticky note, with a quick gut check underneath. */
export function GutCheck({ moments }: { moments: string[] }) {
  const { take, setMoment, ready } = useTake();
  const yes = moments.filter((m) => take.moments[m] === "yes").length;
  const no = moments.filter((m) => take.moments[m] === "no").length;

  const btn = (active: boolean, tone: string) =>
    `min-h-11 flex-1 rounded-[var(--radius-control)] border-2 px-2 text-sm font-bold transition-[background-color,border-color,transform] active:scale-[0.97] ${
      active ? `border-ink ${tone}` : "border-ink/25 bg-sheet hover:border-ink"
    }`;

  return (
    <div>
      <ul className="grid gap-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {moments.map((m, i) => {
          const a = take.moments[m];
          return (
            <li key={m} className="flex flex-col gap-3">
              <StickyNote tone={TONES[i % 3]} rotate={[-1.5, 1.2, -0.6][i % 3]} className="flex-1">
                {m}
              </StickyNote>
              <div className="flex gap-2 px-1.5" role="group" aria-label={`Gut check: ${m}`}>
                <button type="button" onClick={() => setMoment(m, "yes")} aria-pressed={a === "yes"} className={btn(a === "yes", "bg-leaf text-sheet")}>
                  Bring it on
                </button>
                <button type="button" onClick={() => setMoment(m, "no")} aria-pressed={a === "no"} className={btn(a === "no", "bg-margin text-sheet")}>
                  Not for me
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm" aria-live="polite">
        {ready && yes + no > 0 ? (
          <>
            <span className="font-bold tabular-nums">{yes}</span> bring it on · <span className="font-bold tabular-nums">{no}</span> not for me ·{" "}
            <span className="tabular-nums text-ink-2">{moments.length - yes - no} to go</span>
          </>
        ) : (
          <span className="text-ink-2">Go with your gut. Tap again to change your mind.</span>
        )}
      </p>
    </div>
  );
}
