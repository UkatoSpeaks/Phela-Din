/**
 * Tiffin's rules: how meters and effects map to what Tiffin shows.
 * Pure functions (no React, no GSAP) so they're easy to test and tweak.
 *
 *   energy       → food fill level inside the tiers (0–100%)
 *   stress       → steam wisps (0–3) and lid rattle
 *   satisfaction → warm glow behind Tiffin
 */
import type { MeterEffects, Meters } from "@/types/simulation";

/** Sustained states, derived from the meters. */
export type TiffinMood = "idle" | "steaming" | "sleepy";
/** Short reactions (< 600ms) to something that just happened. */
export type TiffinReaction = "happy" | "wince" | "shocked";
export type TiffinExpression = TiffinMood | TiffinReaction;

export const TIFFIN_RULES = {
  /** Stress at or above this → "steaming" (angry brows, full steam, rattling lid). */
  steamingAtStress: 75,
  /** Energy at or below this → "sleepy" (closed eyes, slow breathing, z's). Steaming wins if both. */
  sleepyAtEnergy: 25,
  /** Stress thresholds for 1, 2 and 3 steam wisps. */
  steamWisps: [40, 60, 80],
  /** Lid starts rattling (gently) at this stress. */
  rattleFromStress: 60,
  /** Net harm (harm − good) this big from a single choice makes Tiffin "shocked". */
  shockedAtHarm: 20,
  /** Reaction length in ms. Keep under 600 so it never slows the player down. */
  reactionMs: 550,
} as const;

export function deriveMood(m: Meters): TiffinMood {
  if (m.stress >= TIFFIN_RULES.steamingAtStress) return "steaming";
  if (m.energy <= TIFFIN_RULES.sleepyAtEnergy) return "sleepy";
  return "idle";
}

export function steamLevel(stress: number): 0 | 1 | 2 | 3 {
  const [a, b, c] = TIFFIN_RULES.steamWisps;
  if (stress >= c) return 3;
  if (stress >= b) return 2;
  if (stress >= a) return 1;
  return 0;
}

/** 0 at satisfaction ≤ 20, 1 at ≥ 90. */
export function glowStrength(satisfaction: number): number {
  return Math.min(1, Math.max(0, (satisfaction - 20) / 70));
}

/** Lid rattle amplitude in SVG units: 0 below the threshold, up to 1.6 at 100 stress. */
export function rattleAmplitude(stress: number): number {
  const from = TIFFIN_RULES.rattleFromStress;
  if (stress < from) return 0;
  return 0.4 + ((stress - from) / (100 - from)) * 1.2;
}

/**
 * How Tiffin reacts to a set of meter changes:
 *   harm = stress up + energy down + satisfaction down
 *   good = stress down + energy up + satisfaction up
 * Net harm ≥ 20 → shocked; more harm than good → wince; any net good → happy; nothing → no reaction.
 */
export function reactionForEffects(effects: MeterEffects | undefined): TiffinReaction | null {
  if (!effects) return null;
  const { energy = 0, stress = 0, satisfaction = 0 } = effects;
  const harm = Math.max(0, stress) + Math.max(0, -energy) + Math.max(0, -satisfaction);
  const good = Math.max(0, -stress) + Math.max(0, energy) + Math.max(0, satisfaction);
  if (harm - good >= TIFFIN_RULES.shockedAtHarm) return "shocked";
  if (harm > good) return "wince";
  if (good > 0) return "happy";
  return null;
}
