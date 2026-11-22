"use client";

import { useTake } from "./TakeProvider";

/** Tap the skills you already have. Saved on the device. */
export function SkillsCheck({ skills }: { skills: string[] }) {
  const { take, toggle, ready } = useTake();
  const have = skills.filter((s) => take.skills.includes(s)).length;
  return (
    <div>
      <p className="text-sm text-ink-2">Tap the ones you already have, even a little.</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {skills.map((s) => {
          const on = take.skills.includes(s);
          return (
            <li key={s}>
              <button
                type="button"
                onClick={() => toggle("skills", s)}
                aria-pressed={on}
                className={`flex min-h-10 items-center gap-1.5 rounded-[3px] border-[1.5px] px-2.5 text-left text-sm font-medium transition-[background-color,border-color,transform] active:scale-[0.97] ${
                  on ? "border-ink bg-haldi" : "border-ink/50 bg-sheet hover:border-ink"
                }`}
              >
                <span aria-hidden className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] border-ink text-[11px] font-black leading-none ${on ? "bg-ink text-haldi" : ""}`}>
                  {on ? "✓" : ""}
                </span>
                {s}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm" aria-live="polite">
        {ready && have > 0 ? (
          <>
            You already have <span className="font-bold tabular-nums">{have} of {skills.length}</span>. The rest is what the job teaches you.
          </>
        ) : (
          <span className="text-ink-2">Nobody starts with all of these.</span>
        )}
      </p>
    </div>
  );
}
