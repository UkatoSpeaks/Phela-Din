import type { Metadata } from "next";
import Link from "next/link";
import { CareerBrowser } from "@/components/careers/CareerBrowser";
import { getCareers, getSimulations } from "@/lib/content";
import type { Career } from "@/types/simulation";

export const metadata: Metadata = { title: "Careers · Pehla Din" };

/** Display order: live first, then "Launching first", then wave 2, then the rest. File order breaks ties. */
function rank(c: Career): number {
  if (c.status === "live") return 0;
  if (c.launchWave === 1) return 1;
  if (c.launchWave === 2) return 2;
  return 3;
}

export default function CareersPage() {
  const careers = getCareers()
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rank(a.c) - rank(b.c) || a.i - b.i)
    .map(({ c }) => c);
  const minutesBySimId = Object.fromEntries(getSimulations().map((s) => [s.id, s.estimatedMinutes]));

  return (
    <section className="mx-auto max-w-xl">
      <Link href="/" className="text-sm text-muted">
        ← Pehla Din
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Pick a career to explore</h1>
      <p className="mt-2 text-muted">See the real path, pay and trade-offs, then live a week in the job.</p>
      <CareerBrowser careers={careers} minutesBySimId={minutesBySimId} />
    </section>
  );
}
