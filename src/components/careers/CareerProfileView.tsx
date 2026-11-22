import type { ReactNode } from "react";
import type { CareerProfile } from "@/types/career-profile";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CompetitionReality({ data }: { data: NonNullable<CareerProfile["competitionReality"]> }) {
  return (
    <aside className="rounded-3xl border-2 border-saffron/60 bg-saffron/10 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-terracotta">
        Competition reality{data.basis ? ` · ${data.basis}` : ""}
      </p>
      <p className="mt-2 text-lg font-bold leading-snug">{data.reality}</p>
      <p className="mt-1 text-sm text-muted">{data.signal}</p>
    </aside>
  );
}

function PathTimeline({ path }: { path: CareerProfile["path"] }) {
  return (
    <>
      <ol className="relative ml-2 border-l-2 border-line">
        {path.steps.map((step, i) => (
          <li key={i} className="relative pb-5 pl-6 last:pb-0">
            <span
              className="absolute -left-[11px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="leading-snug">{step}</span>
          </li>
        ))}
      </ol>
      {path.duration || path.note ? (
        <div className="mt-4 space-y-1 rounded-2xl bg-cream p-3 text-sm">
          {path.duration ? (
            <p>
              <span className="font-semibold">⏳ {path.duration}</span>
            </p>
          ) : null}
          {path.note ? <p className="text-muted">{path.note}</p> : null}
        </div>
      ) : null}
    </>
  );
}

function PayTable({ pay, dataAsOf }: { pay: CareerProfile["pay"]; dataAsOf: string }) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="w-2/5 px-3 py-2 font-semibold">
                {pay.columns[0]}
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                {pay.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {pay.rows.map((row) => (
              <tr key={row.label} className="border-t border-line align-top">
                <th scope="row" className="px-3 py-2.5 font-semibold">
                  {row.label}
                </th>
                <td className="px-3 py-2.5">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pay.notes?.map((n) => (
        <p key={n} className="mt-2 text-sm text-muted">
          {n}
        </p>
      ))}
      <p className="mt-3 text-xs text-muted">
        Pay figures are approximate ranges from 2026 public sources and vary by city and employer.{" "}
        <span className="whitespace-nowrap font-semibold">Data as of {dataAsOf}.</span>
      </p>
    </>
  );
}

function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  const list = (items: string[], mark: string, tone: string) => (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-snug">
          <span className={`mt-0.5 font-bold ${tone}`} aria-hidden>
            {mark}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded-3xl bg-leaf/10 p-5">
        <h2 className="mb-3 font-bold text-leaf-deep">The good</h2>
        {list(pros, "+", "text-leaf-deep")}
      </section>
      <section className="rounded-3xl bg-terracotta/10 p-5">
        <h2 className="mb-3 font-bold text-terracotta">The hard parts</h2>
        {list(cons, "−", "text-terracotta")}
      </section>
    </div>
  );
}

/** The "career card": everything from the research profile, read-only. */
export function CareerProfileView({ profile }: { profile: CareerProfile }) {
  return (
    <div className="flex flex-col gap-4">
      {profile.competitionReality ? <CompetitionReality data={profile.competitionReality} /> : null}

      <Section title="The path">
        <PathTimeline path={profile.path} />
      </Section>

      <Section title="What you learn">
        <ul className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <li key={s} className="rounded-full bg-cream px-3 py-1 text-sm">
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={profile.pay.title ? `Pay (${profile.pay.title})` : "Pay"}>
        <PayTable pay={profile.pay} dataAsOf={profile.dataAsOf} />
      </Section>

      <ProsCons pros={profile.pros} cons={profile.cons} />

      <Section title="Sources">
        <ul className="space-y-2 text-sm">
          {profile.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-terracotta underline underline-offset-2 hover:brightness-90"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
