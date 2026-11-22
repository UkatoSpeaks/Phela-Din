"use client";

import { useState } from "react";
import type { Career } from "@/types/simulation";
import { CareerCard } from "./CareerCard";

const ALL = "All";
const LAUNCH = "Launching first";

interface Props {
  /** Already sorted for display. */
  careers: Career[];
  minutesBySimId: Record<string, number>;
}

/** Career grid with filter chips: All · Launching first · one chip per category. */
export function CareerBrowser({ careers, minutesBySimId }: Props) {
  const [filter, setFilter] = useState<string>(ALL);

  // Placeholder categories (the demo) don't get their own chip.
  const categories = [...new Set(careers.filter((c) => c.id !== "sample-career").map((c) => c.category))].sort();
  const chips = [ALL, LAUNCH, ...categories];

  const visible = careers.filter((c) => {
    if (filter === ALL) return true;
    if (filter === LAUNCH) return c.launchWave === 1;
    return c.category === filter;
  });

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
              className={`min-h-10 shrink-0 rounded-full border-2 px-4 text-sm font-semibold transition ${
                active ? "border-terracotta bg-terracotta text-white" : "border-line bg-card text-ink hover:border-saffron"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {visible.map((career) => (
          <CareerCard
            key={career.id}
            career={career}
            estimatedMinutes={career.simulationId ? minutesBySimId[career.simulationId] : undefined}
          />
        ))}
      </div>
    </>
  );
}
