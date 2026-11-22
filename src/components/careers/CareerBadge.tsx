import type { Career } from "@/types/simulation";

const styles = {
  demo: "bg-leaf/15 text-leaf",
  live: "bg-leaf/15 text-leaf",
  launch: "bg-saffron/25 text-terracotta",
  soon: "bg-line text-muted",
} as const;

/** One status badge per career: Try the demo / Live / Launching first / Coming soon. */
export function CareerBadge({ career }: { career: Career }) {
  let kind: keyof typeof styles;
  let label: string;
  if (career.status === "live") {
    kind = career.id === "sample-career" ? "demo" : "live";
    label = kind === "demo" ? "Try the demo" : "Live";
  } else if (career.launchWave === 1) {
    kind = "launch";
    label = "Launching first";
  } else {
    kind = "soon";
    label = "Coming soon";
  }
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[kind]}`}>{label}</span>
  );
}
