import type { ReactNode } from "react";
import { PaperCard } from "@/components/ui/PaperCard";
import type { CareerProfile } from "@/types/career-profile";
import type { FileTab } from "./file/FileTabs";
import { GutCheck } from "./file/GutCheck";
import { OddsVisual } from "./file/OddsVisual";
import { PayLadder } from "./file/PayLadder";
import { Reveal } from "./file/Reveal";
import { SkillsCheck } from "./file/SkillsCheck";
import { WeighScale } from "./file/WeighScale";
import { YourTake } from "./file/YourTake";

/** A numbered dossier section: ink rule, number, Fraunces heading, anchor for the file tabs. */
function Section({ id, n, title, note, children }: { id: string; n: number; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-16 border-t-2 border-ink pt-5">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-black tabular-nums tracking-[0.14em] text-ink-2">{String(n).padStart(2, "0")}</span>
        <h2 id={`${id}-h`} className="text-2xl font-semibold sm:text-[28px]">
          {title}
        </h2>
      </div>
      {note ? <p className="mt-1 max-w-prose text-sm text-ink-2">{note}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PathTimeline({ path }: { path: CareerProfile["path"] }) {
  return (
    <Reveal>
      <PaperCard variant="ledger">
        <ol>
          {path.steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 transition-[opacity,transform] duration-500 group-data-[reveal=armed]/reveal:translate-x-3 group-data-[reveal=armed]/reveal:opacity-0"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <span className="w-5 shrink-0 text-right font-display font-bold tabular-nums text-chai-deep">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        {path.duration || path.note ? (
          <p className="mt-[28px]">
            {path.duration ? <span className="font-bold">{path.duration}. </span> : null}
            {path.note ? <span className="text-ink-2">{path.note}</span> : null}
          </p>
        ) : null}
      </PaperCard>
    </Reveal>
  );
}

/** Which sections a profile has, in order. Used for both the tabs and the numbering. */
export function fileSections(profile: CareerProfile): FileTab[] {
  return [
    profile.competitionReality ? { id: "odds", label: "The odds" } : null,
    { id: "path", label: "Path" },
    { id: "skills", label: "Skills" },
    { id: "pay", label: "Pay" },
    { id: "weigh", label: "Good & hard" },
    { id: "moments", label: "Moments" },
    { id: "take", label: "Your take" },
    { id: "sources", label: "Sources" },
  ].filter((t): t is FileTab => t !== null);
}

/**
 * The full career file below the hero object. Everything comes from the
 * profile JSON. Must be rendered inside <TakeProvider> (interactive sections).
 */
export function CareerProfileView({ profile, careerName, cta }: { profile: CareerProfile; careerName: string; cta: ReactNode }) {
  const sections = fileSections(profile);
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  const cr = profile.competitionReality;

  return (
    <div className="flex flex-col gap-12">
      {cr ? (
        <Section id="odds" n={num("odds")} title="The odds" note={cr.basis ? `From the ${cr.basis} numbers in our research.` : undefined}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
            {cr.visual ? <OddsVisual visual={cr.visual} /> : null}
            <div className={cr.visual ? "" : "md:col-span-2"}>
              <p className="font-display text-2xl font-semibold leading-snug">{cr.reality}</p>
              <p className="mt-2 text-ink-2">{cr.signal}</p>
            </div>
          </div>
        </Section>
      ) : null}

      <Section id="path" n={num("path")} title="The path">
        <PathTimeline path={profile.path} />
      </Section>

      <Section id="skills" n={num("skills")} title="What you learn">
        <SkillsCheck skills={profile.skills} />
      </Section>

      <Section id="pay" n={num("pay")} title={profile.pay.title ? `Pay (${profile.pay.title})` : "Pay"}>
        <PayLadder pay={profile.pay} dataAsOf={profile.dataAsOf} />
      </Section>

      <Section id="weigh" n={num("weigh")} title="Weigh it up" note="Every job has both. Tick the ones that would matter to you and watch the tarazu.">
        <WeighScale profile={profile} />
      </Section>

      <Section id="moments" n={num("moments")} title="Moments you'll live" note="From our research. These become scenes in the simulation.">
        <GutCheck moments={profile.sceneIdeas} />
      </Section>

      <Section id="take" n={num("take")} title="Your take">
        <YourTake profile={profile} careerName={careerName}>
          {cta}
        </YourTake>
      </Section>

      <Section id="sources" n={num("sources")} title="Sources" note="Where every number on this page comes from.">
        <ol className="list-decimal space-y-2 pl-5 text-sm marker:font-bold marker:text-ink-2">
          {profile.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-words font-medium underline decoration-chai decoration-2 underline-offset-4 hover:decoration-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
