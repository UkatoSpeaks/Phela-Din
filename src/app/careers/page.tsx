import type { Metadata } from "next";
import Link from "next/link";
import { AVATAR_BY_CAREER } from "@/components/careers/avatars";
import { CareerBrowser } from "@/components/careers/CareerBrowser";
import type { CareerCardData } from "@/components/careers/CareerIdCard";
import { getCareerProfile, getCareers, getSimulations } from "@/lib/content";
import type { Career } from "@/types/simulation";

export const metadata: Metadata = {
  title: "Careers · Pehla Din",
  description: "Ten careers Indian students are choosing in 2026, with the real path, pay and competition for each.",
};

/** Display order: live first, then "Launching first", then wave 2, then the rest. File order breaks ties. */
function rank(c: Career): number {
  if (c.status === "live") return 0;
  if (c.launchWave === 1) return 1;
  if (c.launchWave === 2) return 2;
  return 3;
}

export default function CareersPage() {
  const minutes = Object.fromEntries(getSimulations().map((s) => [s.id, s.estimatedMinutes]));
  const careers = getCareers()
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rank(a.c) - rank(b.c) || a.i - b.i)
    .map(({ c }) => c);

  // Card facts come straight from the profile (nothing typed by hand).
  const cards: CareerCardData[] = careers.map((career, i) => {
    const p = getCareerProfile(career.id);
    const firstPay = p?.pay.rows[0];
    return {
      career,
      avatar: AVATAR_BY_CAREER[career.id],
      idNo: `PD-${career.category.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(2, "0")}`,
      minutes: career.simulationId ? minutes[career.simulationId] : undefined,
      facts: {
        duration: p?.path.duration,
        entry: p?.path.steps[0],
        startPay: firstPay ? { label: firstPay.label, value: firstPay.value } : undefined,
        reality: p?.competitionReality?.reality,
        scene: p?.sceneIdeas[0],
      },
    };
  });

  return (
    <section className="mx-auto w-full max-w-6xl">
      <nav className="flex items-center justify-between" aria-label="Main">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold">Pehla Din</span>
          <span className="font-hindi text-sm text-ink-2">पहला दिन</span>
        </Link>
      </nav>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-ink-2">The careers</p>
      <h1 className="mt-1 max-w-[16ch] text-[38px] font-semibold leading-[1.05] sm:text-[56px]">Whose ID card would you wear?</h1>
      <p className="mt-3 max-w-prose text-ink-2">
        Ten careers Indian students are choosing in 2026. Flip a card for the quick facts, open the file for the real path, pay and sources.
      </p>
      <CareerBrowser cards={cards} />
    </section>
  );
}
