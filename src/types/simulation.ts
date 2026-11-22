import { z } from "zod";

/**
 * Content schemas. These are the single source of truth for what a
 * simulation / career JSON file may contain. They are used by:
 *   - src/lib/content.ts (build-time loading)
 *   - scripts/validate-content.ts (npm run validate)
 *   - the API route (request/response validation)
 *
 * Content objects use z.strictObject so typos like "efects" fail loudly
 * instead of being silently ignored.
 */

// ---------------------------------------------------------------------------
// Meters
// ---------------------------------------------------------------------------

export const METER_KEYS = ["energy", "stress", "satisfaction"] as const;
export const MeterKeySchema = z.enum(METER_KEYS);
export type MeterKey = z.infer<typeof MeterKeySchema>;

const meterValue = z.number().min(0).max(100);

export const MetersSchema = z.strictObject({
  energy: meterValue,
  stress: meterValue,
  satisfaction: meterValue,
});
export type Meters = z.infer<typeof MetersSchema>;

/** Partial meter changes. Values can be negative, e.g. { energy: -10 }. */
const meterDelta = z.number().min(-100).max(100);
export const MeterEffectsSchema = z.strictObject({
  energy: meterDelta.optional(),
  stress: meterDelta.optional(),
  satisfaction: meterDelta.optional(),
});
export type MeterEffects = z.infer<typeof MeterEffectsSchema>;

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/, "Use lowercase letters, numbers, '-' or '_' (e.g. 'day1-inbox')");

const nonEmpty = z.string().trim().min(1, "Must not be empty");

/** Fields every scene has. */
const sceneBase = {
  id: slug,
  /** Clock time shown to the player, e.g. "9:30 AM". */
  time: nonEmpty,
  text: nonEmpty,
  /** Only show this scene if the flag was set by an earlier choice. */
  requiresFlag: slug.optional(),
};

export const ChoiceSchema = z.strictObject({
  text: nonEmpty,
  effects: MeterEffectsSchema,
  tags: z.array(slug),
  setFlags: z.array(slug).optional(),
  /** Short text shown after the player picks this choice. */
  outcome: nonEmpty.optional(),
});
export type Choice = z.infer<typeof ChoiceSchema>;

export const ChoiceSceneSchema = z.strictObject({
  ...sceneBase,
  type: z.literal("choice"),
  choices: z.array(ChoiceSchema).min(2, "A choice scene needs at least 2 choices"),
});

export const AiTaskSceneSchema = z.strictObject({
  ...sceneBase,
  type: z.literal("ai_task"),
  /** What a good answer looks like. Sent to the AI grader, never shown to the player. */
  rubric: nonEmpty,
  placeholder: nonEmpty,
});

export const EventSceneSchema = z.strictObject({
  ...sceneBase,
  type: z.literal("event"),
  effects: MeterEffectsSchema.optional(),
});

export const SceneSchema = z.discriminatedUnion("type", [ChoiceSceneSchema, AiTaskSceneSchema, EventSceneSchema]);

export type ChoiceScene = z.infer<typeof ChoiceSceneSchema>;
export type AiTaskScene = z.infer<typeof AiTaskSceneSchema>;
export type EventScene = z.infer<typeof EventSceneSchema>;
export type Scene = z.infer<typeof SceneSchema>;

// ---------------------------------------------------------------------------
// Days & simulations
// ---------------------------------------------------------------------------

export const DaySchema = z.strictObject({
  day: z.number().int().positive(),
  title: nonEmpty,
  /** A quote from a real professional, shown on the day intro card. */
  realTalk: nonEmpty,
  scenes: z.array(SceneSchema).min(1, "A day needs at least 1 scene"),
});
export type Day = z.infer<typeof DaySchema>;

export const SimulationSchema = z
  .strictObject({
    id: slug,
    title: nonEmpty,
    subtitle: nonEmpty,
    careerId: slug,
    estimatedMinutes: z.number().int().positive(),
    initialMeters: MetersSchema,
    days: z.array(DaySchema).min(1, "A simulation needs at least 1 day"),
  })
  .superRefine((sim, ctx) => {
    // Cross-field checks that a plain schema can't express.
    const seenIds = new Set<string>();
    const flagsSetSoFar = new Set<string>();

    sim.days.forEach((day, d) => {
      if (day.day !== d + 1) {
        ctx.addIssue({
          code: "custom",
          path: ["days", d, "day"],
          message: `Days must be numbered 1, 2, 3… in order (expected ${d + 1}, got ${day.day})`,
        });
      }

      day.scenes.forEach((scene, s) => {
        if (seenIds.has(scene.id)) {
          ctx.addIssue({
            code: "custom",
            path: ["days", d, "scenes", s, "id"],
            message: `Duplicate scene id "${scene.id}" (scene ids must be unique across the whole simulation)`,
          });
        }
        seenIds.add(scene.id);

        if (scene.requiresFlag && !flagsSetSoFar.has(scene.requiresFlag)) {
          ctx.addIssue({
            code: "custom",
            path: ["days", d, "scenes", s, "requiresFlag"],
            message: `Flag "${scene.requiresFlag}" is never set by a choice before this scene, so this scene can never appear`,
          });
        }

        if (scene.type === "choice") {
          scene.choices.forEach((c) => c.setFlags?.forEach((f) => flagsSetSoFar.add(f)));
        }
      });
    });
  });
export type Simulation = z.infer<typeof SimulationSchema>;

// ---------------------------------------------------------------------------
// Careers
// ---------------------------------------------------------------------------

export const CareerSchema = z
  .strictObject({
    id: slug,
    name: nonEmpty,
    category: nonEmpty,
    shortDescription: nonEmpty,
    status: z.enum(["live", "coming_soon"]),
    /** Launch order from the research: 1 = "Launching first", 2 = second wave. */
    launchWave: z.union([z.literal(1), z.literal(2)]).optional(),
    simulationId: slug.optional(),
  })
  .refine((c) => c.status !== "live" || c.simulationId, {
    message: 'A "live" career must have a simulationId',
    path: ["simulationId"],
  });
export type Career = z.infer<typeof CareerSchema>;

export const CareersFileSchema = z.array(CareerSchema).superRefine((careers, ctx) => {
  const seen = new Set<string>();
  careers.forEach((c, i) => {
    if (seen.has(c.id)) {
      ctx.addIssue({ code: "custom", path: [i, "id"], message: `Duplicate career id "${c.id}"` });
    }
    seen.add(c.id);
  });
});

// ---------------------------------------------------------------------------
// Run state (player progress, stored in localStorage)
// ---------------------------------------------------------------------------

export const RUN_VERSION = 1;

export const AiAnswerSchema = z.object({
  answer: z.string(),
  feedback: z.string().optional(),
  score: z.number().optional(),
});
export type AiAnswer = z.infer<typeof AiAnswerSchema>;

export const RunSchema = z.object({
  version: z.literal(RUN_VERSION),
  simulationId: z.string(),
  status: z.enum(["in_progress", "finished"]),
  /**
   * Where the player is in the flow:
   *   day_intro → scene → (outcome, only after a choice with outcome text) → scene … → next day_intro
   */
  phase: z.enum(["day_intro", "scene", "outcome"]),
  /** Index into sim.days. */
  dayIndex: z.number().int().min(0),
  /** Index into sim.days[dayIndex].scenes (raw index, not the visible-scene index). */
  sceneIndex: z.number().int().min(0),
  meters: MetersSchema,
  flags: z.array(z.string()),
  /** How many times each tag was picked, e.g. { people: 3, analytical: 1 }. */
  tagCounts: z.record(z.string(), z.number()),
  /** Which choice was picked for each choice scene (sceneId → choice index). */
  choices: z.record(z.string(), z.number()),
  /** Written answers to ai_task scenes (sceneId → answer + feedback). */
  aiAnswers: z.record(z.string(), AiAnswerSchema),
  completedSceneIds: z.array(z.string()),
  startedAt: z.string(),
  updatedAt: z.string(),
});
export type Run = z.infer<typeof RunSchema>;

// ---------------------------------------------------------------------------
// API: /api/ai-feedback
// ---------------------------------------------------------------------------

export const AiFeedbackRequestSchema = z.object({
  simulationId: z.string().min(1),
  sceneId: z.string().min(1),
  answer: z.string().trim().min(1, "Answer must not be empty").max(2000, "Answer is too long (max 2000 characters)"),
});
export type AiFeedbackRequest = z.infer<typeof AiFeedbackRequestSchema>;

export const AiFeedbackResponseSchema = z.object({
  feedback: z.string(),
  /** 0–10 */
  score: z.number().min(0).max(10),
});
export type AiFeedbackResponse = z.infer<typeof AiFeedbackResponseSchema>;
