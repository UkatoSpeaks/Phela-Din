import type { Career } from "@/types/simulation";

type Kind = "demo" | "live" | "launch" | "soon";

const styles: Record<Kind, string> = {
  demo: "border-leaf-deep text-leaf-deep",
  live: "border-leaf-deep text-leaf-deep",
  launch: "border-ink bg-haldi text-ink",
  soon: "border-ink/40 text-ink-2",
};

export function badgeFor(career: Career): { kind: Kind; label: string } {
  if (career.status === "live") return career.id === "sample-career" ? { kind: "demo", label: "Sample week" } : { kind: "live", label: "Live" };
  if (career.launchWave === 1) return { kind: "launch", label: "Launching first" };
  return { kind: "soon", label: "Coming soon" };
}

/** A small printed label: Sample week / Live / Launching first / Coming soon. */
export function CareerBadge({ career, className = "" }: { career: Career; className?: string }) {
  const { kind, label } = badgeFor(career);
  return (
    <span className={`inline-block whitespace-nowrap rounded-[3px] border-[1.5px] px-1.5 py-0.5 text-[10px] font-black uppercase leading-none tracking-[0.12em] ${styles[kind]} ${className}`}>
      {label}
    </span>
  );
}
