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
