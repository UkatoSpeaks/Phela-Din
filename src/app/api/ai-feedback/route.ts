import { NextResponse } from "next/server";
import { getSimulation } from "@/lib/content";
import { AiFeedbackRequestSchema, type AiFeedbackResponse } from "@/types/simulation";

/**
 * POST /api/ai-feedback
 * Body: { simulationId, sceneId, answer }
 * Returns: { feedback: string, score: number (0–10) }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });
  }

  const parsed = AiFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 400 },
    );
  }

  const { simulationId, sceneId, answer } = parsed.data;
  const scene = getSimulation(simulationId)
    ?.days.flatMap((d) => d.scenes)
    .find((s) => s.id === sceneId);

  if (!scene || scene.type !== "ai_task") {
    return NextResponse.json({ error: "Unknown AI task" }, { status: 404 });
  }

  // TODO: Replace the placeholder below with a real Groq call.
  //   const apiKey = process.env.GROQ_API_KEY;
  //   if (!apiKey) -> fall back to the placeholder (so local dev works without a key)
  //   POST https://api.groq.com/openai/v1/chat/completions with:
  //     - a system prompt: friendly mentor for Indian students, 2–3 sentences, encouraging but honest
  //     - the task text (scene.text), the rubric (scene.rubric) and the student's answer
  //     - ask for JSON { feedback, score } and validate it with AiFeedbackResponseSchema
  //   Add a timeout and return the placeholder on failure so the sim never gets stuck.
  void scene.rubric;
  void answer;

  const response: AiFeedbackResponse = {
    feedback:
      "Nice work! You explained the situation clearly. Next time, try adding a specific next step or date so your manager knows what happens next.",
    score: 7,
  };
  return NextResponse.json(response);
}
