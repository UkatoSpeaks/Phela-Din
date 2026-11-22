import type { ReactNode } from "react";

type Tone = "haldi" | "rose" | "sky";

interface Props {
  children: ReactNode;
  /** Signature line, e.g. "Priya, 6 yrs in audit". */
  from?: string;
  /** Tiny printed label above the handwriting, e.g. "Real talk". */
  label?: string;
  tone?: Tone;
  /** Degrees, −3 to 3. */
  rotate?: number;
  className?: string;
}

const toneClass: Record<Tone, string> = { haldi: "bg-haldi", rose: "bg-rose", sky: "bg-sky" };

/**
 * A handwritten note stuck on with tape. Caveat is for short text only
 * (≤ ~25 words) and never the only way to get information needed to proceed.
 */
export function StickyNote({ children, from, label, tone = "haldi", rotate = -2, className = "" }: Props) {
  return (
    <figure
      className={`relative mx-1.5 px-5 pb-5 pt-7 text-ink shadow-[var(--shadow-note)] ${toneClass[tone]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Strip of tape with torn ends. */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-sheet/60"
        style={{ clipPath: "polygon(0 8%, 6% 0, 12% 10%, 88% 0, 94% 12%, 100% 4%, 100% 92%, 94% 100%, 88% 90%, 12% 100%, 6% 88%, 0 96%)" }}
      />
      {label ? <figcaption className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">{label}</figcaption> : null}
      <blockquote className="font-hand text-[22px] leading-[1.25]">{children}</blockquote>
      {from ? <p className="mt-3 text-right font-hand text-lg text-ink/80">~ {from}</p> : null}
    </figure>
  );
}
