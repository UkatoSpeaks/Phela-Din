import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CareerBadge } from "@/components/careers/CareerBadge";
import { CareerProfileView } from "@/components/careers/CareerProfileView";
import { ButtonLink } from "@/components/ui/Button";
import { getCareer, getCareerProfile, getCareers, getSimulation } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCareers().map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = getCareer((await params).id);
  return career
    ? { title: `${career.name} · Pehla Din`, description: career.shortDescription }
    : { title: "Pehla Din" };
}

export default async function CareerDetailPage({ params }: Props) {
  const { id } = await params;
  const career = getCareer(id);
  if (!career) notFound();
  const profile = getCareerProfile(id);
  const sim = career.status === "live" && career.simulationId ? getSimulation(career.simulationId) : undefined;

  const cta = sim ? (
    // prefetch off: the player bundles GSAP, which must not download on non-player pages.
    <ButtonLink href={`/sim/${sim.id}`} prefetch={false} className="w-full">
      Try the simulation · ~{sim.estimatedMinutes} min
    </ButtonLink>
  ) : (
    <p className="rounded-2xl bg-line/60 p-4 text-center text-sm font-medium text-muted">
      The simulation for this career is coming soon.
    </p>
  );

  return (
    <article className="mx-auto flex max-w-xl flex-col gap-4">
      <Link href="/careers" className="text-sm text-muted">
        ← All careers
      </Link>

      <header className="rounded-3xl bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">{career.category}</span>
          <CareerBadge career={career} />
          {!sim && career.launchWave === 1 ? (
            <span className="rounded-full bg-line px-2.5 py-0.5 text-xs font-semibold text-muted">Coming soon</span>
          ) : null}
        </div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">{career.name}</h1>
        <p className="mt-2 text-muted">{career.shortDescription}</p>
        <div className="mt-5">{cta}</div>
      </header>

      {profile ? <CareerProfileView profile={profile} /> : null}

      {profile ? <div className="mt-2">{cta}</div> : null}
    </article>
  );
}
