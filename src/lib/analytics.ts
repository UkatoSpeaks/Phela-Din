/**
 * Analytics. For now this only logs to the console.
 *
 * To plug in PostHog later: initialise posthog-js in a client provider and
 * replace the body of track() with `posthog.capture(event, props)`.
 * Call sites don't need to change.
 */

export interface AnalyticsEvents {
  sim_started: { simulationId: string; resumed: boolean };
  scene_completed: { simulationId: string; sceneId: string; sceneType: string; day: number; choiceIndex?: number };
  ai_task_submitted: { simulationId: string; sceneId: string; answerLength: number; score?: number };
  sim_completed: { simulationId: string; verdict?: string; durationSeconds: number };
}

export type AnalyticsEvent = keyof AnalyticsEvents;

export function track<E extends AnalyticsEvent>(event: E, props: AnalyticsEvents[E]): void {
  if (typeof window === "undefined") return;
  // TODO: replace with posthog.capture(event, props)
  console.log(`[analytics] ${event}`, props);
}
