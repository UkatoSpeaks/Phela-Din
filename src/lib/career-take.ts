/**
 * Turns a visitor's taps on a career file page into a gut-check summary.
 * Pure functions, easy to tweak. This is NOT a Fit Report: it only reflects
 * what the visitor said matters to them.
 */
import type { CareerProfile, CareerTake } from "@/types/career-profile";

export type Lean = "not_started" | "closer_look" | "mixed" | "think_it_through";

export interface TakeSummary {
  skillsHave: number;
  skillsTotal: number;
  pros: number;
  cons: number;
  momentsYes: number;
  momentsNo: number;
  momentsTotal: number;
  /** Degrees for the balance beam: negative = "the good" side goes down. */
  tilt: number;
  lean: Lean;
}

export const TAKE_RULES = {
  /** Beam degrees per point of difference between picked pros and cons. */
  degreesPerPick: 5,
  maxTilt: 16,
  /** score = (pros − cons) + (moments yes − no); at or above → "closer_look", at or below −this → "think_it_through". */
  leanThreshold: 2,
} as const;

export function summarizeTake(take: CareerTake, profile: CareerProfile): TakeSummary {
  // Only count picks that still exist in the profile (content can change).
  const skillsHave = take.skills.filter((s) => profile.skills.includes(s)).length;
  const pros = take.pros.filter((p) => profile.pros.includes(p)).length;
  const cons = take.cons.filter((c) => profile.cons.includes(c)).length;
  const answers = profile.sceneIdeas.map((m) => take.moments[m]);
  const momentsYes = answers.filter((a) => a === "yes").length;
  const momentsNo = answers.filter((a) => a === "no").length;

  const { degreesPerPick, maxTilt, leanThreshold } = TAKE_RULES;
  const tilt = Math.max(-maxTilt, Math.min(maxTilt, (cons - pros) * degreesPerPick));

  const touched = pros + cons + momentsYes + momentsNo > 0;
  const score = pros - cons + (momentsYes - momentsNo);
  const lean: Lean = !touched ? "not_started" : score >= leanThreshold ? "closer_look" : score <= -leanThreshold ? "think_it_through" : "mixed";

  return {
    skillsHave,
    skillsTotal: profile.skills.length,
    pros,
    cons,
    momentsYes,
    momentsNo,
    momentsTotal: profile.sceneIdeas.length,
    tilt,
    lean,
  };
}
