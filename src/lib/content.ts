/**
 * Loads and validates all content (careers + simulations) from /content.
 *
 * Server-only: uses the filesystem. Pages call these functions at build time
 * (they're statically generated), and the validate script reuses
 * `validateAllContent()` so both paths apply the exact same rules.
 */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import { CareerProfileSchema, PROFILE_EXEMPT_CAREER_IDS, type CareerProfile } from "@/types/career-profile";
import { CareersFileSchema, SimulationSchema, type Career, type Simulation } from "@/types/simulation";

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const SIMULATIONS_DIR = path.join(CONTENT_DIR, "simulations");
export const CAREERS_FILE = path.join(CONTENT_DIR, "careers.json");
export const PROFILES_DIR = path.join(CONTENT_DIR, "career-profiles");

export interface ContentBundle {
  careers: Career[];
  simulations: Simulation[];
  profiles: CareerProfile[];
}

export interface ValidationResult extends ContentBundle {
  errors: string[];
  /** Non-blocking: things a human should double-check (e.g. numbers not found in the research). */
  warnings: string[];
}

export const RESEARCH_DIR = path.join(CONTENT_DIR, "research");

export class ContentValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Content validation failed:\n${errors.map((e) => `  • ${e}`).join("\n")}`);
    this.name = "ContentValidationError";
  }
}

/** Turns ["days", 0, "scenes", 2, "effects"] into "days[0].scenes[2].effects". */
function formatPath(p: readonly PropertyKey[]): string {
  if (p.length === 0) return "(root)";
  return p.reduce<string>((acc, key) => {
    if (typeof key === "number") return `${acc}[${key}]`;
    return acc ? `${acc}.${String(key)}` : String(key);
  }, "");
}

function rel(file: string): string {
  return path.relative(process.cwd(), file);
}

function formatZodError(file: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => `${rel(file)} → ${formatPath(issue.path)}: ${issue.message}`);
}

function readJson(file: string, errors: string[]): unknown {
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (e) {
    errors.push(`${rel(file)}: could not read file (${(e as Error).message})`);
    return undefined;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    errors.push(`${rel(file)}: invalid JSON (${(e as Error).message})`);
    return undefined;
  }
}

/** Lists *.json files in a directory (sorted), recording an error if it can't be read. */
function listJsonFiles(dir: string, errors: string[]): string[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();
  } catch (e) {
    errors.push(`${rel(dir)}: could not read directory (${(e as Error).message})`);
    return [];
  }
}

/**
 * Validates every content file and returns all errors (doesn't stop at the
 * first one), plus whatever content parsed successfully.
 */
export function validateAllContent(): ValidationResult {
  const errors: string[] = [];
  const simulations: Simulation[] = [];
  const profiles: CareerProfile[] = [];
  let careers: Career[] = [];

  // --- careers.json -------------------------------------------------------
  const careersRaw = readJson(CAREERS_FILE, errors);
  if (careersRaw !== undefined) {
    const parsed = CareersFileSchema.safeParse(careersRaw);
    if (parsed.success) careers = parsed.data;
    else errors.push(...formatZodError(CAREERS_FILE, parsed.error));
  }

  // --- simulations/*.json -------------------------------------------------
  for (const name of listJsonFiles(SIMULATIONS_DIR, errors)) {
    const file = path.join(SIMULATIONS_DIR, name);
    const raw = readJson(file, errors);
    if (raw === undefined) continue;
    const parsed = SimulationSchema.safeParse(raw);
    if (!parsed.success) {
      errors.push(...formatZodError(file, parsed.error));
      continue;
    }
    const expectedId = name.replace(/\.json$/, "");
    if (parsed.data.id !== expectedId) {
      errors.push(`${rel(file)} → id: must match the file name ("${expectedId}"), got "${parsed.data.id}"`);
      continue;
    }
    simulations.push(parsed.data);
  }

  // --- career-profiles/*.json --------------------------------------------
  for (const name of listJsonFiles(PROFILES_DIR, errors)) {
    const file = path.join(PROFILES_DIR, name);
    const raw = readJson(file, errors);
    if (raw === undefined) continue;
    const parsed = CareerProfileSchema.safeParse(raw);
    if (!parsed.success) {
      errors.push(...formatZodError(file, parsed.error));
      continue;
    }
    const expectedId = name.replace(/\.json$/, "");
    if (parsed.data.id !== expectedId) {
      errors.push(`${rel(file)} → id: must match the file name ("${expectedId}"), got "${parsed.data.id}"`);
      continue;
    }
    profiles.push(parsed.data);
  }

  // --- cross-file references ---------------------------------------------
  const simIds = new Set(simulations.map((s) => s.id));
  const careerIds = new Set(careers.map((c) => c.id));
  const profileIds = new Set(profiles.map((p) => p.id));
  const exempt = new Set<string>(PROFILE_EXEMPT_CAREER_IDS);

  careers.forEach((c, i) => {
    if (!exempt.has(c.id) && !profileIds.has(c.id)) {
      errors.push(`${rel(CAREERS_FILE)} → [${i}] "${c.id}": no profile found at ${rel(PROFILES_DIR)}/${c.id}.json`);
    }
  });
  profiles.forEach((p) => {
    if (!careerIds.has(p.id)) {
      errors.push(`${rel(path.join(PROFILES_DIR, `${p.id}.json`))} → id: no career "${p.id}" in ${rel(CAREERS_FILE)}`);
    }
  });

  careers.forEach((c, i) => {
    if (c.simulationId && !simIds.has(c.simulationId)) {
      errors.push(
        `${rel(CAREERS_FILE)} → [${i}].simulationId: no valid simulation "${c.simulationId}" found in ${rel(SIMULATIONS_DIR)}/`,
      );
    }
  });
  simulations.forEach((s) => {
    if (!careerIds.has(s.careerId)) {
      errors.push(
        `${rel(path.join(SIMULATIONS_DIR, `${s.id}.json`))} → careerId: no career "${s.careerId}" in ${rel(CAREERS_FILE)}`,
      );
    }
  });

  // --- research cross-check (warnings) ------------------------------------
  // Drawn odds must use numbers the research actually states.
  const warnings: string[] = [];
  let research = "";
  try {
    research = fs
      .readdirSync(RESEARCH_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => fs.readFileSync(path.join(RESEARCH_DIR, f), "utf8"))
      .join("\n");
  } catch {
    warnings.push(`${rel(RESEARCH_DIR)}: no research files found; skipped the numbers cross-check`);
  }
  if (research) {
    for (const p of profiles) {
      const v = p.competitionReality?.visual;
      if (!v) continue;
      const where = `${rel(path.join(PROFILES_DIR, `${p.id}.json`))} → competitionReality.visual`;
      if (v.type === "one_in") {
        if (!new RegExp(`(1 in ~?${v.n}\\b|every ~?${v.n}\\b)`).test(research)) warnings.push(`${where}.n: "1 in ${v.n}" / "every ${v.n}" not found in the research`);
      } else if (v.type === "bars") {
        v.bars.forEach((b, i) => {
          if (!research.includes(b.display)) warnings.push(`${where}.bars[${i}].display: "${b.display}" not found in the research`);
        });
      } else if (!research.includes(`${v.min}–${v.max}%`)) {
        warnings.push(`${where}: "${v.min}–${v.max}%" not found in the research`);
      }
    }
  }

  return { errors, warnings, careers, simulations, profiles };
}

// Validated once per process (i.e. once per build), then cached.
let cache: ContentBundle | null = null;

/** Loads all content, throwing a ContentValidationError if anything is invalid. */
export function loadAllContent(): ContentBundle {
  if (cache) return cache;
  const { errors, careers, simulations, profiles } = validateAllContent();
  if (errors.length > 0) throw new ContentValidationError(errors);
  cache = { careers, simulations, profiles };
  return cache;
}

export function getCareers(): Career[] {
  return loadAllContent().careers;
}

export function getSimulations(): Simulation[] {
  return loadAllContent().simulations;
}

export function getSimulationIds(): string[] {
  return getSimulations().map((s) => s.id);
}

export function getSimulation(id: string): Simulation | undefined {
  return getSimulations().find((s) => s.id === id);
}

export function getCareer(id: string): Career | undefined {
  return getCareers().find((c) => c.id === id);
}

export function getCareerProfile(careerId: string): CareerProfile | undefined {
  return loadAllContent().profiles.find((p) => p.id === careerId);
}
