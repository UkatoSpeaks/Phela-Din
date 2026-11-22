import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultView } from "@/components/result/ResultView";
import { getSimulation, getSimulationIds } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSimulationIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sim = getSimulation((await params).id);
  return { title: sim ? `Fit Report: ${sim.title} · Pehla Din` : "Pehla Din" };
}

export default async function ResultPage({ params }: Props) {
  const sim = getSimulation((await params).id);
  if (!sim) notFound();
  return (
    <div className="mx-auto max-w-xl">
      <ResultView sim={sim} />
    </div>
  );
}
