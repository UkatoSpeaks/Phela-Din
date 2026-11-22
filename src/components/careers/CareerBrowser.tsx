"use client";

import { useState } from "react";
import { CareerIdCard, type CareerCardData } from "./CareerIdCard";

const ALL = "All";
const LAUNCH = "Launching first";

/** Career ID cards with filter chips: All · Launching first · one chip per category. */
export function CareerBrowser({ cards }: { cards: CareerCardData[] }) {
  const [filter, setFilter] = useState<string>(ALL);

  // The sample's placeholder category doesn't get its own chip.
  const categories = [...new Set(cards.filter((c) => c.career.id !== "sample-career").map((c) => c.career.category))].sort();
  const chips = [ALL, LAUNCH, ...categories];
  const visible = cards.filter(({ career }) =>
    filter === ALL ? true : filter === LAUNCH ? career.launchWave === 1 : career.category === filter,
  );

  return (
    <>
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filter careers">
        {chips.map((chip) => {
          const active = chip === filter;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setFilter(chip)}
              aria-pressed={active}
              className={`min-h-11 shrink-0 rounded-[var(--radius-control)] border-2 px-4 text-sm font-bold transition ${
                active ? "border-ink bg-ink text-sheet" : "border-ink/30 bg-sheet hover:border-ink"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-ink-2" aria-live="polite">
        {visible.length} {visible.length === 1 ? "career" : "careers"}
        {filter === ALL ? "" : ` · ${filter}`}. Tap a card to flip it.
      </p>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((data) => (
          <li key={data.career.id}>
            <CareerIdCard data={data} />
          </li>
        ))}
      </ul>
    </>
  );
}
