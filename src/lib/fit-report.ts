/**
 * Builds the Fit Report from a finished run.
 *
 * All the tunable numbers live in VERDICT_RULES below. Rules are checked in
 * order: probably_not first (any deal-breaker wins), then strong_fit, and
 * everything else is worth_exploring.
 */
import type { Meters, Run } from "@/types/simulation";

export type Verdict = "strong_fit" | "worth_exploring" | "probably_not";

export interface TagShare {
  tag: string;
  label: string;
  count: number;
  /** Share of all tag picks, 0–100, rounded. */
  percent: number;
}

export interface FitReport {
  simulationId: string;
  verdict: Verdict;
  /** Plain-language reasons behind the verdict, for display. */
  reasons: string[];
  topTags: TagShare[];
  finalMeters: Meters;
  aiAnswers: Run["aiAnswers"];
}

// ---------------------------------------------------------------------------
// Tweak these to change how verdicts are decided.
// ---------------------------------------------------------------------------
export const VERDICT_RULES = {
  /** Any ONE of these makes it "probably_not". */
  probablyNot: {
    satisfactionBelow: 40, // the work didn't feel rewarding
    stressAtOrAbove: 80, // stress was unmanageable
    energyBelow: 15, // completely burnt out
  },
  /** ALL of these must hold for "strong_fit". */
  strongFit: {
    satisfactionAtLeast: 65, // the work felt rewarding…
    stressAtMost: 60, // …and stress stayed manageable…
    energyAtLeast: 30, // …and they weren't running on empty
  },
} as const;

export function decideVerdict(m: Meters): { verdict: Verdict; reasons: string[] } {
  const no = VERDICT_RULES.probablyNot;
  const reasons: string[] = [];
  if (m.satisfaction < no.satisfactionBelow) reasons.push("The work didn't feel very satisfying to you.");
  if (m.stress >= no.stressAtOrAbove) reasons.push("Your stress got very high.");
  if (m.energy < no.energyBelow) reasons.push("You ended the week running on empty.");
  if (reasons.length > 0) return { verdict: "probably_not", reasons };

  const yes = VERDICT_RULES.strongFit;
  if (m.satisfaction >= yes.satisfactionAtLeast && m.stress <= yes.stressAtMost && m.energy >= yes.energyAtLeast) {
    return {
      verdict: "strong_fit",
      reasons: ["You found the work satisfying.", "Stress stayed manageable.", "You still had energy left."],
    };
  }

  return {
    verdict: "worth_exploring",
    reasons: ["Some parts clicked and some didn't. Talk to people in this job before deciding."],
  };
}

/** "problem_solving" → "Problem solving" */
export function humanizeTag(tag: string): string {
  const words = tag.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function topTags(tagCounts: Record<string, number>, limit = 3): TagShare[] {
  const total = Object.values(tagCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(tagCounts)
    .sort(([aTag, a], [bTag, b]) => b - a || aTag.localeCompare(bTag))
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, label: humanizeTag(tag), count, percent: Math.round((count / total) * 100) }));
}

export function buildFitReport(run: Run): FitReport {
  const { verdict, reasons } = decideVerdict(run.meters);
  return {
    simulationId: run.simulationId,
    verdict,
    reasons,
    topTags: topTags(run.tagCounts),
    finalMeters: run.meters,
    aiAnswers: run.aiAnswers,
  };
}
