import Link from "next/link";
import type { Career } from "@/types/simulation";
import { CareerBadge } from "./CareerBadge";

interface Props {
  career: Career;
  estimatedMinutes?: number;
}

/** Every card links to the career's detail page; the badge shows its status. */
export function CareerCard({ career, estimatedMinutes }: Props) {
  const isLive = career.status === "live";
  return (
    <Link
      href={`/careers/${career.id}`}
      className={`block rounded-3xl border-2 bg-card p-5 transition hover:border-saffron hover:shadow-md active:scale-[0.99] ${
        isLive ? "border-leaf/40" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{career.category}</span>
        <CareerBadge career={career} />
      </div>
      <h2 className="mt-2 text-lg font-bold">{career.name}</h2>
      <p className="mt-1 text-sm text-muted">{career.shortDescription}</p>
      {isLive && estimatedMinutes ? <p className="mt-3 text-xs font-medium text-leaf">~{estimatedMinutes} min simulation</p> : null}
    </Link>
  );
}
