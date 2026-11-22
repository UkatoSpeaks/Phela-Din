"use client";

/**
 * A career as a landscape office ID card. Tap the front to flip it over;
 * the back is a file summary taken straight from the career profile, with
 * a link to the full file.
 *
 * Both faces share one grid cell, so the card is as tall as its taller face.
 * The face that's turned away is `inert` (no clicks, no focus). Under reduced
 * motion the flip is instant (global CSS rule).
 */
import Link from "next/link";
import { useState } from "react";
import { Avatar, type AvatarId } from "@/components/home/Avatar";
import { Barcode } from "@/components/ui/IdCard";
import type { Career } from "@/types/simulation";
import { CareerBadge } from "./CareerBadge";

export interface CareerCardData {
  career: Career;
  avatar?: AvatarId;
  /** Employee-number style id printed on the card, e.g. "PD-TEC-01". */
  idNo: string;
  minutes?: number;
  facts: {
    duration?: string;
    entry?: string;
    startPay?: { label: string; value: string };
    reality?: string;
    /** A moment from the research ("A production bug at 7pm on Friday"), shown on the front. */
    scene?: string;
  };
}

/** Category colour band (ink text unless noted). */
const BAND: Record<string, string> = {
  Technology: "bg-sky text-ink",
  Healthcare: "bg-leaf text-sheet",
  Finance: "bg-khaki text-ink",
  Government: "bg-khaki-2 text-ink",
  Creative: "bg-rose text-ink",
  Law: "bg-paper-2 text-ink",
  Business: "bg-haldi text-ink",
};

function PhotoAwaited() {
  return (
    <span className="flex h-full w-full flex-col items-center justify-end">
      <svg viewBox="0 0 80 80" className="w-[78%]" aria-hidden>
        <circle cx="40" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 4" />
        <path d="M12 80 C12 58 26 50 40 50 C54 50 68 58 68 80" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 4" />
      </svg>
    </span>
  );
}

const face =
  "[grid-area:1/1] flex flex-col overflow-hidden rounded-[var(--radius-badge)] border-2 border-ink bg-sheet shadow-[var(--shadow-lift)] [backface-visibility:hidden]";

export function CareerIdCard({ data }: { data: CareerCardData }) {
  const { career, avatar, idNo, minutes, facts } = data;
  const [flipped, setFlipped] = useState(false);
  const band = BAND[career.category] ?? "bg-paper-2 text-ink";
  const live = career.status === "live" && career.simulationId;

  return (
    <div className="[perspective:1400px]">
      <div className="grid transition-transform duration-500 ease-out [transform-style:preserve-3d]" style={{ transform: flipped ? "rotateY(180deg)" : undefined }}>
        {/* ---------- Front ---------- */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          inert={flipped}
          aria-label={`${career.name} ID card. Flip for the file summary.`}
          className={`${face} text-left transition-[translate] hover:-translate-y-0.5`}
        >
          <span className={`relative flex items-center justify-between gap-2 py-2 pl-4 pr-3 ${band}`}>
            <span className="text-[11px] font-black uppercase tracking-[0.16em]">{career.category}</span>
            <CareerBadge career={career} className="bg-sheet" />
          </span>
          <span className="flex gap-3 p-3">
            <span className="relative block aspect-[4/5] w-[5.25rem] shrink-0 self-start overflow-hidden rounded-[3px] border-2 border-ink/80 bg-paper-2 text-ink/35">
              {avatar ? <Avatar id={avatar} crop="head" className="absolute inset-0 h-full w-full scale-[1.15]" /> : <PhotoAwaited />}
              {!avatar ? <span className="absolute inset-x-0 bottom-0.5 text-center text-[8px] font-bold uppercase tracking-[0.1em] text-ink-2">Photo awaited</span> : null}
            </span>
            <span className="block min-w-0 flex-1">
              <span className="block font-display text-[20px] font-semibold leading-tight">{career.name}</span>
              <span className="mt-1 line-clamp-3 block text-[13px] leading-snug text-ink-2">{career.shortDescription}</span>
            </span>
          </span>
          {facts.scene ? (
            <span className="mx-3 mb-3 block rounded-[3px] border-l-[4px] border-haldi bg-paper px-3 py-2">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-ink-2">A day in the job</span>
              <span className="mt-0.5 block font-display text-[16px] font-semibold leading-snug">{facts.scene}</span>
            </span>
          ) : null}
          <span className="mt-auto" />
          <span className="flex items-end gap-3 px-3 pb-3">
            <span className="block w-24 shrink-0 text-ink">
              <Barcode value={idNo} />
              <span className="mt-0.5 block text-[9px] font-bold tabular-nums tracking-[0.18em]">{idNo}</span>
            </span>
            <span className="ml-auto text-xs font-bold text-ink-2">
              {live && minutes ? `~${minutes} min · ` : ""}Tap to flip <span aria-hidden>↻</span>
            </span>
          </span>
        </button>

        {/* ---------- Back ---------- */}
        <div className={`${face} [transform:rotateY(180deg)]`} inert={!flipped} aria-hidden={!flipped}>
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink/30 px-4 py-2">
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-ink-2">
              File summary · <span className="font-hindi normal-case tracking-normal">सारांश</span>
            </span>
            <button type="button" onClick={() => setFlipped(false)} className="-my-1 min-h-9 px-1 text-xs font-bold underline decoration-chai decoration-2 underline-offset-4">
              Flip back
            </button>
          </div>
          <div className="flex-1 px-4 py-3 text-[13px] leading-snug">
            <p className="font-display text-lg font-semibold leading-tight">{career.name}</p>
            <dl className="mt-1.5 grid gap-1.5">
            {facts.duration ? <Fact label="How long">{facts.duration}</Fact> : null}
            {facts.entry ? <Fact label="Starts with">{facts.entry}</Fact> : null}
            {facts.startPay ? <Fact label={`Pay · ${facts.startPay.label}`}>{facts.startPay.value}</Fact> : null}
            {facts.reality ? <Fact label="Reality check" tone="text-margin-deep">{facts.reality}</Fact> : null}
            </dl>
            {!facts.duration && !facts.entry && !facts.startPay ? <p className="text-ink-2">{career.shortDescription}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-3">
            {live ? (
              <Link href={`/sim/${career.simulationId}`} prefetch={false} className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] bg-ink px-4 text-sm font-bold text-sheet shadow-[0_3px_0_0_var(--color-khaki-2)] active:translate-y-[3px] active:shadow-none">
                Try the simulation
              </Link>
            ) : null}
            <Link href={`/careers/${career.id}`} className="inline-flex min-h-11 items-center text-sm font-bold underline decoration-chai decoration-2 underline-offset-4">
              Open the full file →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, tone = "text-ink-2", children }: { label: string; tone?: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className={`text-[10px] font-black uppercase tracking-[0.12em] ${tone}`}>{label}</dt>
      <dd className="line-clamp-2">{children}</dd>
    </div>
  );
}
