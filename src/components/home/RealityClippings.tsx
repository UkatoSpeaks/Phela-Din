import Link from "next/link";
import { getCareer, getCareerProfile } from "@/lib/content";

/** Careers whose research has a competition-reality line, in display order. */
const IDS = ["doctor-mbbs", "civil-services", "chartered-accountant", "content-creator"];

/** Torn top/bottom edges, like a newspaper cutting. */
const TORN =
  "polygon(0 3%, 6% 0, 13% 2.5%, 21% 0.5%, 30% 3%, 38% 0, 47% 2%, 55% 0.5%, 64% 3%, 72% 0, 81% 2.5%, 90% 0.5%, 100% 2.5%, 100% 97%, 93% 100%, 85% 97.5%, 76% 99.5%, 67% 97%, 58% 100%, 49% 98%, 40% 99.5%, 31% 97%, 22% 100%, 13% 97.5%, 5% 99.5%, 0 97%)";

export function RealityClippings() {
  const clippings = IDS.flatMap((id) => {
    const career = getCareer(id);
    const cr = getCareerProfile(id)?.competitionReality;
    return career && cr ? [{ id, name: career.name, ...cr }] : [];
  });

  return (
    <section aria-labelledby="reality-title" className="mx-auto w-full min-w-0 max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-2">Reality check</p>
      <h2 id="reality-title" className="mt-1 max-w-[20ch] text-[32px] font-semibold leading-[1.1] sm:text-[44px]">
        The numbers nobody puts in the brochure.
      </h2>
      <p className="mt-2 max-w-prose text-ink-2">
        Every career page has the path, pay, pros, cons and the sources. Here are four, cut out of the research.
      </p>
      <ul className="mt-7 grid gap-6 sm:grid-cols-2">
        {clippings.map((c, i) => (
          <li key={c.id} style={{ transform: `rotate(${i % 2 ? 1.2 : -1}deg)` }}>
            <article className="bg-sheet px-5 pb-6 pt-6 shadow-[var(--shadow-note)]" style={{ clipPath: TORN }}>
              <p className="flex items-center justify-between border-b border-ink pb-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                <span>{c.basis ?? c.name}</span>
                <span className="text-ink-2">2026</span>
              </p>
              <h3 className="mt-3 font-display text-[22px] font-semibold leading-tight">{c.reality}</h3>
              <p className="mt-2 text-sm text-ink-2">{c.signal}</p>
              <Link href={`/careers/${c.id}`} className="mt-3 inline-block text-sm font-bold underline decoration-chai decoration-2 underline-offset-4">
                {c.name}: path, pay and sources
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
