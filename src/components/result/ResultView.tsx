"use client";

/** Reads the saved run from localStorage (client only) and renders the Fit Report. */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buildFitReport } from "@/lib/fit-report";
import { clearRun, loadRun } from "@/lib/storage";
import type { Run, Simulation } from "@/types/simulation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FitReport } from "./FitReport";

export function ResultView({ sim }: { sim: Simulation }) {
  const router = useRouter();
  // undefined = still loading, null = no saved run
  const [run, setRun] = useState<Run | null | undefined>(undefined);

  useEffect(() => {
    setRun(loadRun(sim.id));
  }, [sim.id]);

  if (run === undefined) return <p className="py-20 text-center text-muted">Loading…</p>;

  if (!run || run.status !== "finished") {
    return (
      <div className="flex flex-col gap-4 py-10 text-center">
        <h1 className="text-2xl font-extrabold">No report yet</h1>
        <p className="text-muted">Finish the {sim.title} simulation to see your Fit Report.</p>
        <ButtonLink href={`/sim/${sim.id}`}>{run ? "Continue where you left off" : "Start the simulation"}</ButtonLink>
        <ButtonLink href="/careers" variant="secondary">
          Browse careers
        </ButtonLink>
      </div>
    );
  }

  function playAgain() {
    clearRun(sim.id);
    router.push(`/sim/${sim.id}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <FitReport report={buildFitReport(run)} sim={sim} />
      <ButtonLink href="/careers">Try another career</ButtonLink>
      <Button variant="secondary" onClick={playAgain}>
        Play this one again
      </Button>
    </div>
  );
}
