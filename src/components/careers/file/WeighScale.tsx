"use client";

/**
 * The tarazu: tick the good points and hard parts that matter to YOU, and the
 * balance tips. Beam rotation comes from lib/career-take (TAKE_RULES).
 */
import { summarizeTake } from "@/lib/career-take";
import type { CareerProfile } from "@/types/career-profile";
import { useTake } from "./TakeProvider";

const L = 78; // half-beam length in SVG units

function Pan({ x, y, label, count, tone }: { x: number; y: number; label: string; count: number; tone: string }) {
  return (
    <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 450ms cubic-bezier(.3,1.4,.5,1)" }}>
      <path d="M0 0 L-24 34 M0 0 L24 34" stroke="var(--color-ink)" strokeWidth="1.6" />
      <path d="M-30 34 H30 Q26 48 0 48 Q-26 48 -30 34 Z" fill={tone} stroke="var(--color-ink)" strokeWidth="2.2" strokeLinejoin="round" />
      {/* weights: one block per pick, stacked */}
      {Array.from({ length: Math.min(count, 6) }, (_, i) => (
        <rect key={i} x={-21 + (i % 3) * 14} y={26 - Math.floor(i / 3) * 9} width="12" height="8" rx="1.5" fill="var(--color-ink)" />
      ))}
      <text y="64" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--color-ink)" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </text>
    </g>
  );
}

function ToggleList({ items, picked, onToggle, mark, tone }: { items: string[]; picked: string[]; onToggle: (s: string) => void; mark: string; tone: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const on = picked.includes(item);
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => onToggle(item)}
              aria-pressed={on}
              className={`flex w-full gap-3 rounded-[var(--radius-control)] border-2 px-3 py-2.5 text-left leading-snug transition-[background-color,border-color] ${
                on ? `border-ink ${tone}` : "border-ink/15 bg-sheet hover:border-ink/50"
              }`}
            >
              <span aria-hidden className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink text-xs font-black ${on ? "bg-ink text-sheet" : ""}`}>
                {on ? mark : ""}
              </span>
              <span>{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function WeighScale({ profile }: { profile: CareerProfile }) {
  const { take, toggle, ready } = useTake();
  const s = summarizeTake(take, profile);
  const rad = (s.tilt * Math.PI) / 180;
  const left = { x: -L * Math.cos(rad), y: -L * Math.sin(rad) };
  const right = { x: L * Math.cos(rad), y: L * Math.sin(rad) };

  const verdict =
    !ready || s.pros + s.cons === 0
      ? "Tick what matters to you, not what sounds right."
      : s.pros > s.cons
        ? `For you, the good side is heavier (${s.pros} vs ${s.cons}).`
        : s.cons > s.pros
          ? `For you, the hard parts weigh more (${s.cons} vs ${s.pros}).`
          : `Evenly balanced for you (${s.pros} each).`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      {/* the tarazu */}
      <div className="lg:sticky lg:top-20">
        <svg viewBox="-120 -24 240 150" className="mx-auto w-full max-w-[22rem]" role="img" aria-label={`Balance scale. ${verdict}`}>
          <path d="M0 -6 V112 M-34 112 H34" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
          <path d="M-10 -14 L0 -2 L10 -14 Z" fill="var(--color-ink)" />
          <g style={{ transform: `rotate(${s.tilt}deg)`, transition: "transform 450ms cubic-bezier(.3,1.4,.5,1)" }}>
            <rect x={-L - 4} y="-3" width={2 * L + 8} height="6" rx="3" fill="var(--color-khaki-2)" stroke="var(--color-ink)" strokeWidth="2" />
          </g>
          <circle cx="0" cy="0" r="5.5" fill="var(--color-haldi)" stroke="var(--color-ink)" strokeWidth="2" />
          <Pan x={left.x} y={left.y} label="The good" count={s.pros} tone="var(--color-leaf)" />
          <Pan x={right.x} y={right.y} label="Hard parts" count={s.cons} tone="var(--color-margin)" />
        </svg>
        <p className="mt-2 text-center font-display text-lg font-semibold" aria-live="polite">
          {verdict}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        {/* Phones: the big scale scrolls away while you tick, so keep a mini one in view. */}
        <div aria-hidden className="sticky top-[3.4rem] z-10 -mx-1 flex items-center gap-3 rounded-[var(--radius-control)] border-2 border-ink bg-sheet px-3 py-1.5 shadow-[0_3px_0_0_var(--color-ink)] sm:col-span-2 lg:hidden">
          <span className="text-sm font-black tabular-nums text-leaf-deep">{s.pros} good</span>
          <svg viewBox="-50 -12 100 24" className="h-6 flex-1">
            <g style={{ transform: `rotate(${s.tilt}deg)`, transition: "transform 450ms cubic-bezier(.3,1.4,.5,1)" }}>
              <rect x="-44" y="-2" width="88" height="4" rx="2" fill="var(--color-khaki-2)" stroke="var(--color-ink)" strokeWidth="1.5" />
              <circle cx="-42" cy="0" r="5" fill="var(--color-leaf)" stroke="var(--color-ink)" strokeWidth="1.5" />
              <circle cx="42" cy="0" r="5" fill="var(--color-margin)" stroke="var(--color-ink)" strokeWidth="1.5" />
            </g>
            <circle cx="0" cy="0" r="3.5" fill="var(--color-haldi)" stroke="var(--color-ink)" strokeWidth="1.5" />
          </svg>
          <span className="text-sm font-black tabular-nums text-margin-deep">{s.cons} hard</span>
        </div>
        <div>
          <h3 className="mb-2 font-display text-xl font-semibold text-leaf-deep">The good</h3>
          <ToggleList items={profile.pros} picked={take.pros} onToggle={(i) => toggle("pros", i)} mark="+" tone="bg-leaf/15" />
        </div>
        <div>
          <h3 className="mb-2 font-display text-xl font-semibold text-margin-deep">The hard parts</h3>
          <ToggleList items={profile.cons} picked={take.cons} onToggle={(i) => toggle("cons", i)} mark="−" tone="bg-margin/15" />
        </div>
      </div>
    </div>
  );
}
