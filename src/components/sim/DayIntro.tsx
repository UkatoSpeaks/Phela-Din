import type { Day } from "@/types/simulation";
import { Button } from "@/components/ui/Button";

interface Props {
  day: Day;
  totalDays: number;
  onStart: () => void;
}

export function DayIntro({ day, totalDays, onStart }: Props) {
  return (
    <div className="animate-fade-up rounded-3xl bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
        Day {day.day} of {totalDays}
      </p>
      <h2 className="mt-1 text-2xl font-extrabold">{day.title}</h2>
      <figure className="mt-5 rounded-2xl border-l-4 border-saffron bg-cream p-4">
        <figcaption className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Real talk</figcaption>
        <blockquote className="text-lg italic leading-relaxed">{day.realTalk}</blockquote>
      </figure>
      <Button className="mt-6 w-full" onClick={onStart}>
        Start the day
      </Button>
    </div>
  );
}
