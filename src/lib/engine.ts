/**
 * Simulation engine. Pure functions only: every function takes the current
 * Run and returns a NEW Run (never mutates). No React, no browser APIs, so
 * this is trivially unit-testable.
 *
 * Flow per day:  day_intro → scene → [outcome] → scene → … → next day_intro → … → finished
 */
import {
  METER_KEYS,
  RUN_VERSION,
  type AiAnswer,
  type Day,
  type MeterEffects,
  type Meters,
  type Run,
  type Scene,
  type Simulation,
} from "@/types/simulation";

export class EngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EngineError";
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

/** Applies partial meter effects and clamps every meter to 0–100. */
export function applyEffects(meters: Meters, effects: MeterEffects | undefined): Meters {
  if (!effects) return meters;
  const next = { ...meters };
  for (const key of METER_KEYS) {
    next[key] = clamp(meters[key] + (effects[key] ?? 0));
  }
  return next;
}

function isSceneVisible(scene: Scene, flags: readonly string[]): boolean {
  return !scene.requiresFlag || flags.includes(scene.requiresFlag);
}

function touch(run: Run): Run {
  return { ...run, updatedAt: new Date().toISOString() };
}

/**
 * Finds the next visible scene strictly after (dayIndex, sceneIndex) in the
 * same day. Returns -1 if there is none.
 */
function nextVisibleIndexInDay(day: Day, fromIndex: number, flags: readonly string[]): number {
  for (let i = fromIndex + 1; i < day.scenes.length; i++) {
    const scene = day.scenes[i];
    if (scene && isSceneVisible(scene, flags)) return i;
  }
  return -1;
}

/**
 * Moves the cursor past the current scene: to the next visible scene in the
 * same day, else to the next day that has at least one visible scene (as a
 * day_intro), else marks the run finished.
 */
function advanceCursor(sim: Simulation, run: Run): Run {
  const currentDay = sim.days[run.dayIndex];
  if (currentDay) {
    const nextInDay = nextVisibleIndexInDay(currentDay, run.sceneIndex, run.flags);
    if (nextInDay !== -1) return { ...run, phase: "scene", sceneIndex: nextInDay };
  }

  for (let d = run.dayIndex + 1; d < sim.days.length; d++) {
    const day = sim.days[d];
    if (!day) continue;
    const first = nextVisibleIndexInDay(day, -1, run.flags);
    if (first !== -1) return { ...run, phase: "day_intro", dayIndex: d, sceneIndex: first };
  }

  return { ...run, status: "finished" };
}

function markCompleted(run: Run, sceneId: string): Run {
  if (run.completedSceneIds.includes(sceneId)) return run;
  return { ...run, completedSceneIds: [...run.completedSceneIds, sceneId] };
}

/** Throws unless `sceneId` is the scene the player is currently on. */
function requireCurrentScene<T extends Scene["type"]>(
  sim: Simulation,
  run: Run,
  sceneId: string,
  type: T,
): Extract<Scene, { type: T }> {
  if (run.status !== "in_progress") throw new EngineError("Run is already finished");
  if (run.phase !== "scene") throw new EngineError(`Cannot act on a scene during phase "${run.phase}"`);
  const scene = getCurrentScene(sim, run);
  if (!scene || scene.id !== sceneId) {
    throw new EngineError(`Scene "${sceneId}" is not the current scene (current: "${scene?.id ?? "none"}")`);
  }
  if (scene.type !== type) throw new EngineError(`Scene "${sceneId}" is a "${scene.type}" scene, not "${type}"`);
  return scene as Extract<Scene, { type: T }>;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Creates a fresh run positioned at the Day 1 intro. */
export function startRun(sim: Simulation): Run {
  const now = new Date().toISOString();
  const blank: Run = {
    version: RUN_VERSION,
    simulationId: sim.id,
    status: "in_progress",
    phase: "day_intro",
    dayIndex: 0,
    sceneIndex: -1, // advanceCursor moves to the first visible scene
    meters: { ...sim.initialMeters },
    flags: [],
    tagCounts: {},
    choices: {},
    aiAnswers: {},
    completedSceneIds: [],
    startedAt: now,
    updatedAt: now,
  };
  // Position on the first visible scene of Day 1, but show the day intro first.
  const positioned = advanceCursor(sim, blank);
  return { ...positioned, phase: "day_intro" };
}

/** Scenes in a day the player will actually see, given the flags set so far. */
export function getVisibleScenes(day: Day, run: Pick<Run, "flags">): Scene[] {
  return day.scenes.filter((s) => isSceneVisible(s, run.flags));
}

export function getCurrentDay(sim: Simulation, run: Run): Day | undefined {
  return sim.days[run.dayIndex];
}

export function getCurrentScene(sim: Simulation, run: Run): Scene | undefined {
  return sim.days[run.dayIndex]?.scenes[run.sceneIndex];
}

/**
 * Player picked a choice. Applies effects/tags/flags. If the choice has
 * outcome text, the run moves to the "outcome" phase (call nextStep to
 * continue); otherwise it advances straight to the next scene.
 */
export function applyChoice(sim: Simulation, run: Run, sceneId: string, choiceIndex: number): Run {
  const scene = requireCurrentScene(sim, run, sceneId, "choice");
  const choice = scene.choices[choiceIndex];
  if (!choice) throw new EngineError(`Scene "${sceneId}" has no choice at index ${choiceIndex}`);

  const tagCounts = { ...run.tagCounts };
  for (const tag of choice.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;

  const flags = [...run.flags];
  for (const flag of choice.setFlags ?? []) if (!flags.includes(flag)) flags.push(flag);

  let next: Run = {
    ...run,
    meters: applyEffects(run.meters, choice.effects),
    tagCounts,
    flags,
    choices: { ...run.choices, [sceneId]: choiceIndex },
  };
  next = markCompleted(next, sceneId);
  next = choice.outcome ? { ...next, phase: "outcome" } : advanceCursor(sim, next);
  return touch(next);
}

/** Player acknowledged an event scene. Applies its effects and advances. */
export function completeEvent(sim: Simulation, run: Run, sceneId: string): Run {
  const scene = requireCurrentScene(sim, run, sceneId, "event");
  let next: Run = { ...run, meters: applyEffects(run.meters, scene.effects) };
  next = markCompleted(next, sceneId);
  return touch(advanceCursor(sim, next));
}

/** Player submitted (and has seen feedback for) an AI task. Stores it and advances. */
export function submitAiTask(sim: Simulation, run: Run, sceneId: string, answer: AiAnswer): Run {
  requireCurrentScene(sim, run, sceneId, "ai_task");
  let next: Run = { ...run, aiAnswers: { ...run.aiAnswers, [sceneId]: answer } };
  next = markCompleted(next, sceneId);
  return touch(advanceCursor(sim, next));
}

/**
 * Generic "Continue" from a non-scene phase:
 *   day_intro → the day's first visible scene
 *   outcome   → the next scene / next day / finished
 * Calling it during "scene" is an error; use applyChoice / completeEvent / submitAiTask.
 */
export function nextStep(sim: Simulation, run: Run): Run {
  if (run.status === "finished") return run;
  switch (run.phase) {
    case "day_intro":
      return touch({ ...run, phase: "scene" });
    case "outcome":
      return touch(advanceCursor(sim, run));
    case "scene":
      throw new EngineError("nextStep called during a scene; the scene must be completed first");
  }
}

/** Rough progress for a progress bar: completed visible scenes / total visible so far. */
export function getProgress(sim: Simulation, run: Run): { completed: number; total: number } {
  const total = sim.days.reduce((n, day) => n + getVisibleScenes(day, run).length, 0);
  return { completed: run.completedSceneIds.length, total: Math.max(total, run.completedSceneIds.length) };
}
