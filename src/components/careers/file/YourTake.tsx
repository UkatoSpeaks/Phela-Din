"use client";

/**
 * Sums up the visitor's taps on this page. Explicitly a gut check, not a Fit
 * Report: the real answer comes from living the week.
 */
import type { ReactNode } from "react";
import { PaperCard } from "@/components/ui/PaperCard";
import { Stamp } from "@/components/ui/Stamp";
import { summarizeTake, type Lean } from "@/lib/career-take";
import type { CareerProfile } from "@/types/career-profile";
import { useTake } from "./TakeProvider";

const LEAN: Record<Exclude<Lean, "not_started">, { stamp: string; tone: "leaf" | "stamp" | "margin"; line: string }> = {
  closer_look: { stamp: "Worth a closer look", tone: "leaf", line: "What you picked leans towards this job." },
  mixed: { stamp: "Mixed feelings", tone: "stamp", line: "Some of it pulls you in, some of it doesn't. That's normal." },
  think_it_through: { stamp: "Think it through", tone: "margin", line: "The hard parts weigh more for you. Worth knowing early." },
};

export function YourTake({ profile, careerName, children }: { profile: CareerProfile; careerName: string; children?: ReactNode }) {
  const { take, ready, reset } = useTake();
  const s = summarizeTake(take, profile);
  const lean = ready && s.lean !== "not_started" ? LEAN[s.lean] : null;

  return (
    <PaperCard variant="ledger" className="relative">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-ink-2">Your take · {careerName}</p>
      {lean ? (
        <>
          <ul className="mt-[2px]">
            <li>
              Skills you already have: <span className="font-bold tabular-nums">{s.skillsHave} of {s.skillsTotal}</span>
            </li>
            <li>
              What matters to you: <span className="font-bold tabular-nums text-leaf-deep">{s.pros} good</span> ·{" "}
              <span className="font-bold tabular-nums text-margin-deep">{s.cons} hard</span>
            </li>
            <li>
              Moments: <span className="font-bold tabular-nums">{s.momentsYes}</span> bring it on · <span className="font-bold tabular-nums">{s.momentsNo}</span> not for me
            </li>
            <li className="font-bold">{lean.line}</li>
          </ul>
          <div className="flex min-h-[56px] items-center">
            <Stamp key={s.lean} label={lean.stamp} tone={lean.tone} rotate={-4} size="md" animate />
          </div>
          <p className="text-sm text-ink-2">
            This is a gut check from your taps, not a Fit Report.{" "}
            <button type="button" onClick={reset} className="min-h-11 font-bold text-ink underline decoration-chai decoration-2 underline-offset-4">
              Clear my answers
            </button>
          </p>
        </>
      ) : (
        <p>Tick a few good points and hard parts, and answer the moments above. Your take on this career shows up here.</p>
      )}
      <div className="mt-[28px] pb-1">{children}</div>
    </PaperCard>
  );
}
