import Link from "next/link";
import { DeskSection } from "@/components/home/DeskSection";
import { HeroStage } from "@/components/home/HeroStage";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RealityClippings } from "@/components/home/RealityClippings";
import { getCast } from "@/components/home/cast";
import { ButtonLink } from "@/components/ui/Button";
import { PaperCard } from "@/components/ui/PaperCard";
import { StickyNote } from "@/components/ui/StickyNote";
import { getCareers, getSimulation } from "@/lib/content";

/** The live sample simulation powers the try-it-here scene and the main CTA. */
const SAMPLE_SIM_ID = "sample-career";
const DEMO_SCENE_ID = "d1-colleague";

export default function HomePage() {
  const cast = getCast();
  const sim = getSimulation(SAMPLE_SIM_ID);
  const demoScene = sim?.days.flatMap((d) => d.scenes).find((s) => s.id === DEMO_SCENE_ID);
  if (!sim || demoScene?.type !== "choice") throw new Error(`Home: sample scene "${DEMO_SCENE_ID}" missing or not a choice scene`);
  const careerCount = getCareers().filter((c) => c.id !== "sample-career").length;

  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {/* ---- Top bar ---------------------------------------------------- */}
      <nav className="mx-auto -mb-12 flex w-full max-w-5xl items-center justify-between sm:-mb-20" aria-label="Main">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold">Pehla Din</span>
          <span className="font-hindi text-sm text-ink-2">पहला दिन</span>
        </Link>
        <Link href="/careers" className="min-h-11 content-center px-1 text-sm font-bold underline decoration-chai decoration-2 underline-offset-4">
          All careers
        </Link>
      </nav>

      {/* ---- Hero ------------------------------------------------------- */}
      <section className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14" aria-labelledby="hero-title">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-2">
            Career simulations for Class 10–12, college students and parents
          </p>
          <h1 id="hero-title" className="mt-3 text-[42px] font-semibold leading-[1.02] sm:text-[64px]">
            Live the job before you choose it.
          </h1>
          <p className="mt-4 max-w-prose text-[18px] leading-relaxed text-ink-2">
            Pick a career and spend a realistic week in it: the 9:30 emails, the 7 pm bug, the patient&apos;s worried family. You make the calls. At
            the end you get an honest <span className="font-bold text-ink">Fit Report</span> on whether it suits you.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/sim/${SAMPLE_SIM_ID}`} prefetch={false}>
              Try the sample week · {sim.estimatedMinutes} min
            </ButtonLink>
            <ButtonLink href="/careers" variant="secondary">
              Explore {careerCount} careers
            </ButtonLink>
          </div>
          <p className="mt-3 text-sm text-ink-2">No sign-up. Your progress stays on your phone.</p>
        </div>

        <div>
          <p className="mb-3 font-display text-xl font-semibold">Who do you want to be on your pehla din?</p>
          <HeroStage cast={cast} />
        </div>
      </section>

      <HowItWorks demoScene={demoScene} initialMeters={sim.initialMeters} simId={sim.id} />

      <DeskSection />

      <RealityClippings />

      {/* ---- Parents + final CTA ---------------------------------------- */}
      <section className="mx-auto grid w-full max-w-5xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]" aria-labelledby="start-title">
        <StickyNote label="For parents" tone="sky" rotate={-1.5} className="max-w-sm">
          No marks, no right answers. Play a week of the job together, then talk about the Fit Report over chai.
        </StickyNote>
        <PaperCard variant="file" tab="Your file" fileNo="PD/2026/001" subject="Your pehla din">
          <h2 id="start-title" className="font-display text-[28px] font-semibold leading-tight">
            Your first day starts here.
          </h2>
          <p className="mt-2">Five careers are launching first: Software Engineer, Doctor, CA, Civil Services and Content Creator. Try the sample week now.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/sim/${SAMPLE_SIM_ID}`} prefetch={false}>
              Start the sample week
            </ButtonLink>
            <ButtonLink href="/careers" variant="secondary">
              Browse careers
            </ButtonLink>
          </div>
        </PaperCard>
      </section>

      <footer className="mx-auto w-full max-w-5xl border-t-2 border-ink pt-4 text-sm text-ink-2">
        <p>
          <span className="font-display font-semibold text-ink">Pehla Din</span> · Live the job before you choose it.
        </p>
        <p className="mt-1">Pay and competition figures are approximate, from 2026 public sources, and vary by city and employer.</p>
      </footer>
    </div>
  );
}
