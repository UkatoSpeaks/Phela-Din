import type { CSSProperties } from "react";

type Tone = "stamp" | "leaf" | "margin" | "ink";
type Size = "sm" | "md" | "lg";

interface Props {
  label: string;
  /** Second line: a date, a day, "Pehla Din"… */
  sub?: string;
  tone?: Tone;
  shape?: "rect" | "round";
  /** Degrees. Loose objects sit between −8° and 8°. */
  rotate?: number;
  size?: Size;
  /** Play the "thump" on mount. Re-mount (change key) to replay. */
  animate?: boolean;
  className?: string;
}

const toneClass: Record<Tone, string> = {
  stamp: "text-stamp",
  leaf: "text-leaf",
  margin: "text-margin",
  ink: "text-ink",
};

const rectSize: Record<Size, string> = {
  sm: "text-xs px-2 py-1",
  md: "text-base px-3 py-1.5",
  lg: "text-2xl px-4 py-2",
};

const roundSize: Record<Size, string> = { sm: "w-20", md: "w-28", lg: "w-40" };

/** Stable id from a string, so server-rendered SVG ids don't collide (no hooks needed). */
function hashId(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `pd-stamp-${(h >>> 0).toString(36)}`;
}

/**
 * A rubber stamp in violet stamp-pad ink (or green/red/black).
 * Roughened, patchy ink comes from the shared #pd-ink filter (InkFilters).
 */
export function Stamp({ label, sub, tone = "stamp", shape = "rect", rotate = -6, size = "md", animate = false, className = "" }: Props) {
  const style = {
    "--stamp-rotate": `${rotate}deg`,
    filter: "url(#pd-ink)",
    ...(animate ? {} : { transform: `rotate(${rotate}deg)` }),
  } as CSSProperties;

  const common = `inline-block select-none opacity-90 mix-blend-multiply ${toneClass[tone]} ${animate ? "animate-stamp" : ""} ${className}`;
  const a11y = { role: "img" as const, "aria-label": sub ? `${label}, ${sub}` : label };

  if (shape === "round") {
    const id = hashId(label + (sub ?? ""));
    return (
      <span className={`${common} ${roundSize[size]}`} style={style} {...a11y}>
        <svg viewBox="0 0 120 120" className="block h-auto w-full" aria-hidden>
          <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="4.5" />
          <circle cx="60" cy="60" r="41" fill="none" stroke="currentColor" strokeWidth="1.6" />
          {/* Text baseline at r=44 so the caps sit between the inner (41) and outer (55) rings. */}
          <path id={id} d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" fill="none" />
          <text fill="currentColor" fontSize="10.5" fontWeight="900" letterSpacing="1.6" style={{ textTransform: "uppercase" }}>
            <textPath href={`#${id}`} startOffset="25%" textAnchor="middle">
              {label}
            </textPath>
          </text>
          {sub ? (
            <text x="60" y="66" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="900" letterSpacing="1">
              {sub}
            </text>
          ) : (
            <circle cx="60" cy="60" r="4" fill="currentColor" />
          )}
        </svg>
      </span>
    );
  }

  return (
    <span className={`${common} rounded-[3px] border-[3px] border-current p-[3px]`} style={style} {...a11y}>
      <span className={`block rounded-[1px] border-[1.5px] border-current text-center font-black uppercase leading-none tracking-[0.08em] ${rectSize[size]}`}>
        {label}
        {sub ? <span className="mt-1 block text-[0.6em] tracking-[0.14em]">{sub}</span> : null}
      </span>
    </span>
  );
}
