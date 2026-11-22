import type { OddsVisual as OddsVisualData } from "@/types/career-profile";
import { Reveal } from "./Reveal";

/**
 * Draws the competition reality from structured, research-checked numbers.
 * Animations are CSS only, gated by <Reveal> (armed → shown).
 */

function Person({ highlight }: { highlight: boolean }) {
  return (
    <svg viewBox="0 0 24 32" className="h-full w-full" aria-hidden>
      <circle cx="12" cy="8" r="6" fill={highlight ? "var(--color-haldi)" : "currentColor"} stroke="var(--color-ink)" strokeWidth={highlight ? 2 : 0} />
      <path d="M2 32 C2 20 6 16 12 16 C18 16 22 20 22 32 Z" fill={highlight ? "var(--color-haldi)" : "currentColor"} stroke="var(--color-ink)" strokeWidth={highlight ? 2 : 0} />
    </svg>
  );
}

function OneInPeople({ n, what, per }: { n: number; what: string; per: string }) {
  const cols = n <= 8 ? n : 8;
  return (
    <figure>
      <div className="grid gap-x-2 gap-y-3 text-ink/20" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 2.25rem))` }} aria-hidden>
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            className="block aspect-[3/4] transition-[opacity,transform] duration-300 group-data-[reveal=armed]/reveal:translate-y-2 group-data-[reveal=armed]/reveal:opacity-0"
            style={{ transitionDelay: `${i * 35}ms` }}
          >
            <Person highlight={i === 0} />
          </span>
        ))}
      </div>
      <figcaption className="mt-3 text-sm">
        <span className="font-bold">1 {what}</span> for every <span className="font-bold tabular-nums">{n}</span> {per}.
      </figcaption>
    </figure>
  );
}

function OneInDots({ n, what, per }: { n: number; what: string; per: string }) {
  const cols = 40;
  const rows = Math.ceil(n / cols);
  const lucky = Math.floor(n * 0.62); // the one, placed off-centre
  return (
    <figure>
      <svg viewBox={`0 0 ${cols * 8} ${rows * 8}`} className="w-full" aria-hidden>
        {Array.from({ length: n }, (_, i) => {
          const x = (i % cols) * 8 + 4;
          const y = Math.floor(i / cols) * 8 + 4;
          return i === lucky ? null : <circle key={i} cx={x} cy={y} r="2.3" fill="var(--color-ink)" opacity="0.22" />;
        })}
        <g
          className="origin-center transition-[opacity,transform] delay-500 duration-500 [transform-box:fill-box] group-data-[reveal=armed]/reveal:scale-0 group-data-[reveal=armed]/reveal:opacity-0"
        >
          <circle cx={(lucky % cols) * 8 + 4} cy={Math.floor(lucky / cols) * 8 + 4} r="4.2" fill="var(--color-haldi)" stroke="var(--color-ink)" strokeWidth="1.6" />
        </g>
      </svg>
      <figcaption className="mt-3 text-sm">
        <span className="font-bold">1 {what}</span> for every <span className="font-bold tabular-nums">~{n}</span> {per}. Each dot is one of them; find the yellow one.
      </figcaption>
    </figure>
  );
}

function Bars({ caption, bars }: { caption: string; bars: { label: string; value: number; display: string }[] }) {
  const max = Math.max(...bars.map((b) => b.value));
  const first = bars[0]!;
  const last = bars[bars.length - 1]!;
  const fold = first.value / last.value;
  return (
    <figure>
      <figcaption className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-ink-2">{caption}</figcaption>
      <dl className="space-y-3">
        {bars.map((b, i) => (
          <div key={b.label} className="grid grid-cols-[3rem_1fr] items-center gap-3">
            <dt className="text-sm font-bold tabular-nums">{b.label}</dt>
            <dd className="flex items-center gap-2">
              <span
                className="block h-7 rounded-[2px] bg-ink transition-[width] duration-700 ease-out group-data-[reveal=armed]/reveal:!w-0"
                style={{ width: `${(b.value / max) * 78}%`, transitionDelay: `${i * 180}ms` }}
              />
              <span className="whitespace-nowrap font-display text-lg font-semibold tabular-nums">{b.display}</span>
            </dd>
          </div>
        ))}
      </dl>
      {fold > 1.5 ? (
        <p className="mt-3 text-sm">
          About <span className="font-bold tabular-nums">{Math.round(fold)}×</span> fewer from {first.label} to {last.label}.
        </p>
      ) : null}
    </figure>
  );
}

function PercentRange({ min, max, of }: { min: number; max: number; of: string }) {
  return (
    <figure>
      <div className="grid w-full max-w-[17rem] grid-cols-10 gap-1.5" aria-hidden>
        {Array.from({ length: 100 }, (_, i) => {
          const solid = i < min;
          const maybe = !solid && i < max;
          return (
            <span
              key={i}
              className={`block aspect-square rounded-full transition-opacity duration-300 ${
                solid ? "border-2 border-ink bg-haldi" : maybe ? "border-2 border-dashed border-ink bg-haldi/40" : "bg-ink/20"
              } ${solid || maybe ? "group-data-[reveal=armed]/reveal:opacity-0" : ""}`}
              style={{ transitionDelay: solid || maybe ? `${300 + i * 60}ms` : undefined }}
            />
          );
        })}
      </div>
      <figcaption className="mt-3 text-sm">
        Only about <span className="font-bold tabular-nums">{min}–{max} in every 100</span>: {of}.
      </figcaption>
    </figure>
  );
}

export function OddsVisual({ visual }: { visual: OddsVisualData }) {
  let body: React.ReactNode;
  if (visual.type === "one_in") body = visual.n <= 60 ? <OneInPeople {...visual} /> : <OneInDots {...visual} />;
  else if (visual.type === "bars") body = <Bars caption={visual.caption} bars={visual.bars} />;
  else body = <PercentRange min={visual.min} max={visual.max} of={visual.of} />;
  return <Reveal>{body}</Reveal>;
}
