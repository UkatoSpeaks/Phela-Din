import type { CareerProfile } from "@/types/career-profile";
import { Reveal } from "./Reveal";

/**
 * Pay as a ladder you climb: each row is a rung, stepping up and to the right.
 * Text is exactly as in the research (no parsed or rounded numbers).
 */
export function PayLadder({ pay, dataAsOf }: { pay: CareerProfile["pay"]; dataAsOf: string }) {
  const n = pay.rows.length;
  return (
    <div>
      <Reveal>
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-ink-2">
          {pay.columns[0]} → {pay.columns[1]}
        </p>
        <ol className="mt-3 flex flex-col-reverse gap-3">
          {/* flex-col-reverse: lowest rung at the bottom, like climbing */}
          {[...pay.rows].reverse().map((row, ri) => {
            const i = n - 1 - ri; // 0 = first stage
            return (
              <li
                key={row.label}
                className="relative rounded-[var(--radius-paper)] border-2 border-ink bg-sheet px-4 py-3 shadow-[0_3px_0_0_var(--color-ink)] transition-[opacity,transform] duration-500 ease-out group-data-[reveal=armed]/reveal:translate-y-4 group-data-[reveal=armed]/reveal:opacity-0"
                style={{ marginLeft: `min(${i * 1.25}rem, ${i * 6}%)`, transitionDelay: `${i * 160}ms` }}
              >
                <span aria-hidden className="absolute -left-[2px] -top-[2px] rounded-br-[4px] rounded-tl-[3px] bg-ink px-1.5 text-[10px] font-black tabular-nums text-sheet">
                  {i + 1}
                </span>
                <p className="pl-5 font-bold leading-snug">{row.label}</p>
                <p className="mt-0.5 pl-5 leading-snug">{row.value}</p>
              </li>
            );
          })}
        </ol>
      </Reveal>
      <div className="mt-4 text-xs text-ink-2">
        {pay.notes?.map((note) => (
          <p key={note} className="mb-1.5 text-sm text-ink">
            {note}
          </p>
        ))}
        <p>
          Pay figures are approximate ranges from 2026 public sources and vary by city and employer.{" "}
          <span className="whitespace-nowrap font-bold text-ink">Data as of {dataAsOf}.</span>
        </p>
      </div>
    </div>
  );
}
