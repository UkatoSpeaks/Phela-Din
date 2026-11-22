"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IdCard } from "@/components/ui/IdCard";
import { Stamp } from "@/components/ui/Stamp";

/** Interactive bits of the /design page: replaying the stamp, flipping the ID card. */
export function StampReplay() {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex min-h-28 flex-wrap items-center gap-6">
        <Stamp key={`a${n}`} label="Approved" sub="22 Nov 2026" tone="leaf" rotate={-7} size="lg" animate />
        <Stamp key={`b${n}`} label="Day 1" sub="Pehla Din" shape="round" rotate={8} size="md" animate />
      </div>
      <Button variant="secondary" onClick={() => setN((x) => x + 1)}>
        Stamp again
      </Button>
    </div>
  );
}

export function IdCardFlip() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-start gap-4">
      <IdCard
        name="Ananya Kulkarni"
        role="Chartered Accountant (Trainee)"
        org="Mehta & Rao Associates"
        validity="Pune · Valid from Pehla Din"
        idNo="CA-2026-0417"
        accent="khaki"
        fields={[
          { label: "Blood group", value: "B+" },
          { label: "Valid upto", value: "31 Mar 2029" },
        ]}
        flipped={flipped}
        back={
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">If found, return to</p>
            <p className="mt-1 font-display text-lg leading-snug">3rd floor, Shivaji Nagar, Pune 411005</p>
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Path</dt>
                <dd>Foundation → Inter → Articleship → Final</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-2">Newly qualified</dt>
                <dd>Average ~₹13 LPA</dd>
              </div>
            </dl>
            <p className="mt-auto font-hand text-xl text-chai">Tap to flip back</p>
          </>
        }
      />
      <Button variant="secondary" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>
        {flipped ? "Show front" : "Flip card"}
      </Button>
    </div>
  );
}
