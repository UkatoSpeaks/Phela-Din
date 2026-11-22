import { z } from "zod";

/**
 * Career profile schema (content/career-profiles/<career-id>.json).
 *
 * Every value is copied word-for-word from content/research/careers-2026.md.
 * Pay values are stored as display text, not parsed numbers, because the
 * research mixes LPA, monthly stipends, basic pay and qualitative rows
 * ("Little or nothing"). Fields the research doesn't cover are optional.
 */

const nonEmpty = z.string().trim().min(1, "Must not be empty");

export const PayRowSchema = z.strictObject({
  /** e.g. "Fresher", "Entry (Level 10)", "Top NLU → corporate law firm" */
  label: nonEmpty,
  /** e.g. "~₹4–7 LPA at service companies; much higher at product companies" */
  value: nonEmpty,
});

export const PayTableSchema = z.strictObject({
  /** Heading qualifier from the research, e.g. "7th Pay Commission" or "very uneven". */
  title: nonEmpty.optional(),
  /** Column headers as in the research, e.g. ["Stage", "Range"] or ["Path", "Reality"]. */
  columns: z.tuple([nonEmpty, nonEmpty]),
  rows: z.array(PayRowSchema).min(1),
  /** Extra lines under the table. */
  notes: z.array(nonEmpty).optional(),
});

/**
 * A drawable version of the competition reality. Only add one when the
 * research states the numbers explicitly; `npm run validate` warns if a
 * number or display string can't be found in content/research/.
 */
export const OddsVisualSchema = z.discriminatedUnion("type", [
  /** "1 MBBS seat for every 16 NEET UG registrants" → 16 figures, one highlighted. */
  z.strictObject({
    type: z.literal("one_in"),
    n: z.number().int().min(2).max(2000),
    /** Singular thing that's scarce, e.g. "MBBS seat". */
    what: nonEmpty,
    /** Plural group it's shared between, e.g. "NEET UG registrants". */
    per: nonEmpty,
  }),
  /** A few comparable values, e.g. fresher hiring FY22 vs FY25. */
  z.strictObject({
    type: z.literal("bars"),
    caption: nonEmpty,
    bars: z
      .array(z.strictObject({ label: nonEmpty, value: z.number().positive(), display: nonEmpty }))
      .min(2)
      .max(4),
  }),
  /** "~8–10% of creators earn a meaningful income" → 100 dots, 8 solid + 2 hatched. */
  z.strictObject({
    type: z.literal("percent_range"),
    min: z.number().min(0).max(100),
    max: z.number().min(0).max(100),
    of: nonEmpty,
  }),
]);
export type OddsVisual = z.infer<typeof OddsVisualSchema>;

export const CareerProfileSchema = z.strictObject({
  /** Must match a career id in content/careers.json and the file name. */
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Profile heading in the research, e.g. "Doctor (MBBS → Specialist)". */
  title: nonEmpty,
  /** When the research was compiled, shown next to the pay disclaimer, e.g. "Nov 2026". */
  dataAsOf: nonEmpty,
  path: z.strictObject({
    steps: z.array(nonEmpty).min(1),
    /** e.g. "10+ years to become a specialist" */
    duration: nonEmpty.optional(),
    note: nonEmpty.optional(),
  }),
  skills: z.array(nonEmpty).min(1),
  pay: PayTableSchema,
  pros: z.array(nonEmpty).min(1),
  cons: z.array(nonEmpty).min(1),
  /** From the research's demand-signals table. Only some careers have one. */
  competitionReality: z
    .strictObject({
      /** The research's row name when it differs from the career, e.g. "Engineering / Tech". */
      basis: nonEmpty.optional(),
      signal: nonEmpty,
      reality: nonEmpty,
      visual: OddsVisualSchema.optional(),
    })
    .optional(),
  sceneIdeas: z.array(nonEmpty).min(1),
  sources: z
    .array(
      z.strictObject({
        label: nonEmpty,
        url: z.url({ protocol: /^https$/, message: "Must be an https URL" }),
      }),
    )
    .min(1),
});

export type PayTable = z.infer<typeof PayTableSchema>;
export type CareerProfile = z.infer<typeof CareerProfileSchema>;

/** Careers that don't need a profile (placeholders / demos). */
export const PROFILE_EXEMPT_CAREER_IDS = ["sample-career"] as const;

/**
 * A visitor's own reactions on a career file page (saved on their device):
 * skills they already have, pros/cons that matter to them, and a gut check
 * on each research moment.
 */
export const CareerTakeSchema = z.object({
  careerId: z.string(),
  skills: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  moments: z.record(z.string(), z.enum(["yes", "no"])),
});
export type CareerTake = z.infer<typeof CareerTakeSchema>;
