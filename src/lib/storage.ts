/**
 * Save / resume runs in localStorage, one per simulation.
 *
 * Every access is guarded: on the server (SSR) or when storage is blocked
 * (private mode, quota exceeded, corrupted data) these functions quietly
 * return null / do nothing instead of crashing the page.
 */
import { RunSchema, type Run } from "@/types/simulation";

const KEY_PREFIX = "pehla-din:run:";

const keyFor = (simulationId: string) => `${KEY_PREFIX}${simulationId}`;

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null; // e.g. access denied in some privacy modes
  }
}

export function saveRun(run: Run): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(keyFor(run.simulationId), JSON.stringify(run));
  } catch (e) {
    console.warn("[storage] Could not save run", e);
  }
}

/** Returns the saved run, or null if missing, corrupted, or from an older format. */
export function loadRun(simulationId: string): Run | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(keyFor(simulationId));
    if (!raw) return null;
    const parsed = RunSchema.safeParse(JSON.parse(raw));
    if (!parsed.success || parsed.data.simulationId !== simulationId) {
      storage.removeItem(keyFor(simulationId));
      return null;
    }
    return parsed.data;
  } catch (e) {
    console.warn("[storage] Could not load run", e);
    return null;
  }
}

export function clearRun(simulationId: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(keyFor(simulationId));
  } catch (e) {
    console.warn("[storage] Could not clear run", e);
  }
}
