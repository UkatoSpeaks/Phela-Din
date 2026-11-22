import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AVATAR_BY_CAREER } from "@/components/careers/avatars";
import { CareerBadge } from "@/components/careers/CareerBadge";
import { CareerProfileView, fileSections } from "@/components/careers/CareerProfileView";
import { FileTabs } from "@/components/careers/file/FileTabs";
import { TakeProvider } from "@/components/careers/file/TakeProvider";
import { HeroObject } from "@/components/careers/HeroObject";
import { ButtonLink } from "@/components/ui/Button";
import { getCareer, getCareerProfile, getCareers, getSimulation } from "@/lib/content";
import { getHeroObject } from "@/types/simulation";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCareers().map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = getCareer((await params).id);
  return career ? { title: `${career.name} · Pehla Din`, description: career.shortDescription } : { title: "Pehla Din" };
}

export default async function CareerDetailPage({ params }: Props) {
  const { id } = await params;
  const career = getCareer(id);
  if (!career) notFound();
  const profile = getCareerProfile(id);
  const sim = career.status === "live" && career.simulationId ? getSimulation(career.simulationId) : undefined;
  const index = getCareers().findIndex((c) => c.id === id);
  const fileNo = `PD/${career.category.slice(0, 3).toUpperCase()}/2026/${String(index + 1).padStart(2, "0")}`;

  // File labels, all derived from data (never typed by hand).
  const tags = [
    career.category,
    profile?.path.duration,
    profile?.path.steps[0] ? `Starts with: ${profile.path.steps[0]}` : undefined,
    career.launchWave === 2 ? "Second wave" : undefined,
  ].filter((t): t is string => Boolean(t));

  const cta = sim ? (
    // prefetch off: the player bundles GSAP; don't download it until asked.
    <ButtonLink href={`/sim/${sim.id}`} prefetch={false} className="w-full sm:w-auto">
      Try the simulation · ~{sim.estimatedMinutes} min
    </ButtonLink>
  ) : (
    <p className="rounded-[var(--radius-control)] border-2 border-dashed border-ink/40 px-4 py-3 text-sm">
      <span className="font-bold">Simulation coming soon.</span> Until then, this file has the real path, pay and trade-offs.
    </p>
  );

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col gap-10">
      <nav className="flex items-center justify-between gap-4" aria-label="Breadcrumb">
        <Link href="/careers" className="min-h-11 content-center text-sm font-bold underline decoration-chai decoration-2 underline-offset-4">
          ← All careers
        </Link>
        <Link href="/" className="font-display text-lg font-semibold">
          Pehla Din
        </Link>
      </nav>

      <HeroObject
        kind={getHeroObject(career)}
        careerName={career.name}
        category={career.category}
        fileNo={fileNo}
        avatar={AVATAR_BY_CAREER[career.id]}
        sceneLine={profile?.sceneIdeas[0]}
        dataAsOf={profile?.dataAsOf}
      >
        <div className="flex flex-wrap items-center gap-2">
          <CareerBadge career={career} />
        </div>
        <h1 className="mt-2 text-[34px] font-semibold leading-[1.05] sm:text-[48px]">{career.name}</h1>
        <p className="mt-2 max-w-prose text-[17px]">{career.shortDescription}</p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="File labels">
          {tags.map((t) => (
            <li key={t} className="rounded-[3px] border-[1.5px] border-ink bg-paper-2 px-2 py-0.5 text-xs font-bold">
              {t}
            </li>
          ))}
        </ul>

        {profile?.competitionReality ? (
          <aside className="mt-5 border-l-[5px] border-margin bg-paper/70 py-2 pl-4 pr-2">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-margin-deep">
              Competition reality{profile.competitionReality.basis ? ` · ${profile.competitionReality.basis}` : ""}
            </p>
            <p className="mt-1 font-display text-xl font-semibold leading-snug">{profile.competitionReality.reality}</p>
            <a href="#odds" className="mt-1 inline-flex min-h-10 items-center text-sm font-bold underline decoration-chai decoration-2 underline-offset-4">
              See the odds drawn out ↓
            </a>
          </aside>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {cta}
          {profile ? (
            <a href="#weigh" className="inline-flex min-h-11 items-center justify-center text-sm font-bold underline decoration-chai decoration-2 underline-offset-4">
              Or weigh it up first ↓
            </a>
          ) : null}
        </div>
      </HeroObject>

      {profile ? (
        <TakeProvider careerId={career.id}>
          <div className="-mt-4 flex flex-col gap-8">
            <FileTabs tabs={fileSections(profile)} />
            <CareerProfileView profile={profile} careerName={career.name} cta={cta} />
          </div>
        </TakeProvider>
      ) : null}
    </article>
  );
}
