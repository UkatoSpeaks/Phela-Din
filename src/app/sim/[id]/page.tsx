import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SimPlayer } from "@/components/sim/SimPlayer";
import { getSimulation, getSimulationIds } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

// Pre-render one page per simulation at build time; unknown ids 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getSimulationIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sim = getSimulation((await params).id);
  return { title: sim ? `${sim.title} · Pehla Din` : "Pehla Din" };
}

export default async function SimPage({ params }: Props) {
  const sim = getSimulation((await params).id);
  if (!sim) notFound();
  return (
    <div className="mx-auto max-w-xl">
      <SimPlayer sim={sim} />
    </div>
  );
}
