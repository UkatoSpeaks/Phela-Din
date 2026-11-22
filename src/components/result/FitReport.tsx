import type { FitReport as FitReportData, Verdict } from "@/lib/fit-report";
import type { Simulation } from "@/types/simulation";
import { MeterBar } from "@/components/sim/MeterBar";

const VERDICT_COPY: Record<Verdict, { emoji: string; title: string; tone: string }> = {
  strong_fit: { emoji: "🌟", title: "Strong fit", tone: "bg-leaf/15 text-leaf" },
  worth_exploring: { emoji: "🧭", title: "Worth exploring", tone: "bg-saffron/20 text-terracotta" },
  probably_not: { emoji: "🤔", title: "Probably not for you", tone: "bg-terracotta/15 text-terracotta" },
};

interface Props {
  report: FitReportData;
  sim: Simulation;
}

/** Presentational only: takes a computed report and renders it. */
export function FitReport({ report, sim }: Props) {
  const copy = VERDICT_COPY[report.verdict];
  const aiTaskScenes = sim.days.flatMap((d) => d.scenes).filter((s) => s.type === "ai_task");

  return (
    <div className="flex flex-col gap-5">
      <header className="animate-fade-up rounded-3xl bg-card p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Your Fit Report · {sim.title}</p>
        <p className="mt-4 text-5xl" aria-hidden>
          {copy.emoji}
        </p>
        <h1 className={`mx-auto mt-3 inline-block rounded-full px-4 py-1 text-2xl font-extrabold ${copy.tone}`}>
          {copy.title}
        </h1>
        <ul className="mt-4 space-y-1 text-muted">
          {report.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </header>

      <section className="rounded-3xl bg-card p-6 shadow-sm">
        <h2 className="font-bold">How you ended the week</h2>
        <div className="mt-3">
          <MeterBar meters={report.finalMeters} />
        </div>
      </section>

      {report.topTags.length > 0 ? (
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="font-bold">What your choices say about you</h2>
          <ul className="mt-4 space-y-3">
            {report.topTags.map((t) => (
              <li key={t.tag}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{t.label}</span>
                  <span className="tabular-nums text-muted">{t.percent}%</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-saffron transition-[width] duration-700" style={{ width: `${t.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {aiTaskScenes.some((s) => report.aiAnswers[s.id]) ? (
        <section className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="font-bold">Your written work</h2>
          {aiTaskScenes.map((s) => {
            const a = report.aiAnswers[s.id];
            if (!a) return null;
            return (
              <div key={s.id} className="mt-4 rounded-2xl bg-cream p-4 text-sm">
                <p className="whitespace-pre-wrap italic">&ldquo;{a.answer}&rdquo;</p>
                {a.feedback ? (
                  <p className="mt-2">
                    <span className="font-semibold text-leaf">{a.score !== undefined ? `${a.score}/10 · ` : ""}</span>
                    {a.feedback}
                  </p>
                ) : null}
              </div>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
