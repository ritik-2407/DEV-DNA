
// app/lib/llm.ts
// Public interface — delegates to the router which manages
// Groq (primary) ↔ OpenRouter (fallback) switching automatically.
import { runRouter } from "./llmRouter"

export async function runLLM(prompt: string): Promise<string | null> {
  return runRouter(prompt)
}
