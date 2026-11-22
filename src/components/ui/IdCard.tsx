import type { ReactNode } from "react";

type Accent = "khaki" | "chai" | "leaf" | "stamp" | "margin";

interface Props {
  name: string;
  role: string;
  org: string;
  /** Employee number printed on the card and encoded in the barcode. */
  idNo: string;
  /** Shown in the photo box when there's no photo. Defaults to the name's initials. */
  initials?: string;
  accent?: Accent;
  /** Small line under the org band, e.g. "Pehla Din · Day 1". */
  validity?: string;
  /** Small printed fields, like a real Indian ID card: Blood Group, Valid Upto… (max 2; the card has a fixed ID-1 shape). */
  fields?: { label: string; value: string }[];
  /** Optional back face. When provided, `flipped` turns the card over. */
  back?: ReactNode;
  flipped?: boolean;
  className?: string;
}

const accentClass: Record<Accent, string> = {
  khaki: "bg-khaki text-ink",
  chai: "bg-chai text-sheet",
  leaf: "bg-leaf text-sheet",
  stamp: "bg-stamp text-sheet",
  margin: "bg-margin text-sheet",
};

/** Deterministic barcode bars from a string: same id, same barcode. */
export function Barcode({ value }: { value: string }) {
  let seed = 7;
  for (const ch of value) seed = (seed * 33 + ch.charCodeAt(0)) >>> 0;
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 96) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const w = 1 + (seed % 3);
    const gap = 1 + ((seed >> 8) % 2);
    bars.push({ x, w });
    x += w + gap;
  }
  return (
    <svg viewBox="0 0 96 18" preserveAspectRatio="none" className="h-5 w-full" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="18" fill="currentColor" />
      ))}
    </svg>
  );
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const face =
  "absolute inset-0 flex flex-col overflow-hidden rounded-[var(--radius-badge)] border-2 border-ink bg-sheet shadow-[var(--shadow-lift)] [backface-visibility:hidden]";

/**
 * A vertical office ID badge with a lanyard slot. Pass `back` + `flipped`
 * to turn it over (500ms rotateY; instant under reduced motion).
 */
export function IdCard({ name, role, org, idNo, initials, accent = "khaki", validity, fields, back, flipped = false, className = "" }: Props) {
  return (
    <div className={`relative aspect-[54/86] w-full max-w-[15rem] [perspective:1200px] ${className}`}>
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped && back ? "rotateY(180deg)" : undefined }}
      >
        {/* Front */}
        <div className={face} aria-hidden={flipped && back ? true : undefined}>
          <div className={`relative px-4 pb-3 pt-7 ${accentClass[accent]}`}>
            {/* Lanyard slot */}
            <span aria-hidden className="absolute left-1/2 top-2.5 h-2.5 w-12 -translate-x-1/2 rounded-full bg-paper ring-2 ring-ink/80" />
            <p className="text-center text-[11px] font-black uppercase tracking-[0.16em]">{org}</p>
            {validity ? <p className="mt-0.5 text-center text-[10px] font-medium opacity-85">{validity}</p> : null}
          </div>
          <div className="flex flex-1 flex-col items-center px-4 pt-4">
            <div
              className="flex aspect-[4/5] w-[46%] items-center justify-center rounded-[3px] border-2 border-ink/80 bg-paper-2 font-display text-3xl font-semibold text-ink/80"
              style={{
                backgroundImage: "repeating-linear-gradient(135deg, transparent 0 6px, rgb(30 26 21 / 0.06) 6px 7px)",
              }}
            >
              {initials ?? initialsOf(name)}
            </div>
            <p className="mt-3 text-center font-display text-xl font-semibold leading-tight">{name}</p>
            <p className="mt-1 text-center text-sm text-ink-2">{role}</p>
            {fields?.length ? (
              <dl className="mt-3 grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 border-t border-dashed border-ink/30 pt-2 text-[11px]">
                {fields.slice(0, 2).map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="font-bold uppercase tracking-[0.1em] text-ink-2">{f.label}</dt>
                    <dd className="text-right font-bold tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <div className="mt-auto px-4 pb-4 text-ink">
            <Barcode value={idNo} />
            <p className="mt-1 text-center text-[11px] font-bold tabular-nums tracking-[0.2em]">{idNo}</p>
          </div>
        </div>

        {/* Back */}
        {back ? (
          <div className={`${face} [transform:rotateY(180deg)]`} aria-hidden={flipped ? undefined : true}>
            <span aria-hidden className="absolute left-1/2 top-2.5 h-2.5 w-12 -translate-x-1/2 rounded-full bg-paper ring-2 ring-ink/80" />
            <div className="flex h-full flex-col px-4 pb-4 pt-8 text-sm">{back}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
