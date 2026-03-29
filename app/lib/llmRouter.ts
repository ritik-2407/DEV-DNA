// app/lib/llmRouter.ts
// The brain — decides which provider to use on every request.
//
// Flow:
//  1. Read cooldown state from Redis.
//  2. If still in cooldown  → go straight to OpenRouter (skip Groq).
//  3. If cooldown expired   → probe Groq with the real request.
//       ✓ Success           → clear cooldown, return Groq response.
//       ✗ 429 rate-limit    → double the cooldown (cap 24 h), save to Redis,
//                             fallback to OpenRouter transparently.

import {
  groqClient,
  GROQ_MODEL,
  openRouterClient,
  OPENROUTER_MODEL,
} from "./llmProviders";

import {
  getGroqCooldownState,
  setGroqCooldownState,
  clearGroqCooldownState,
  INITIAL_COOLDOWN_MS,
  MAX_COOLDOWN_MS,
} from "./redis";

// ---------------------------------------------------------------------------
// Shared message shape
// ---------------------------------------------------------------------------
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true when the HTTP status indicates a Groq rate limit. */
function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    // groq-sdk surfaces the HTTP status on .status or .statusCode
    if (e.status === 429 || e.statusCode === 429) return true;
    // Fallback: scan the message string
    const msg = String(e.message ?? "").toLowerCase();
    if (msg.includes("rate limit") || msg.includes("429")) return true;
  }
  return false;
}

/** Call OpenRouter and return the text response. */
async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const completion = await openRouterClient.chat.completions.create({
    model: OPENROUTER_MODEL,
    temperature: 0.6,
    messages,
  });
  return completion.choices[0].message.content ?? "";
}

/** Call Groq and return the text response. */
async function callGroq(messages: ChatMessage[]): Promise<string> {
  const completion = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.6,
    messages,
  });
  return completion.choices[0].message.content ?? "";
}

// ---------------------------------------------------------------------------
// Public router
// ---------------------------------------------------------------------------

/**
 * runRouter — drop-in replacement for a direct LLM call.
 *
 * @param prompt  The user/system prompt string.
 * @returns       The model's text response.
 */
export async function runRouter(prompt: string): Promise<string> {
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];

  // 1. Read current cooldown state from Redis
  const { nextGroqRetry, cooldownDuration } = await getGroqCooldownState();
  const now = Date.now();

  // 2. Still inside Groq's cooldown window → use OpenRouter immediately
  if (nextGroqRetry > 0 && now < nextGroqRetry) {
    const remaining = Math.round((nextGroqRetry - now) / 1000 / 60);
    console.log(
      `[LLM Router] Groq in cooldown — ${remaining} min remaining. Using OpenRouter.`
    );
    return callOpenRouter(messages);
  }

  // 3. No active cooldown (or cooldown just expired) → probe Groq
  try {
    const response = await callGroq(messages);

    // ✓ Groq responded cleanly — reset any prior cooldown
    if (nextGroqRetry > 0) {
      console.log("[LLM Router] Groq recovered. Clearing cooldown state.");
      await clearGroqCooldownState();
    }

    return response;
  } catch (err) {
    if (!isRateLimitError(err)) {
      // Non-429 error — rethrow, don't engage fallback
      throw err;
    }

    // ✗ Groq returned 429 — calculate the next (doubled) cooldown
    const nextDuration = Math.min(
      nextGroqRetry > 0 ? cooldownDuration * 2 : INITIAL_COOLDOWN_MS,
      MAX_COOLDOWN_MS
    );
    const nextRetryTimestamp = now + nextDuration;

    console.warn(
      `[LLM Router] Groq rate-limited (429). ` +
        `Cooldown set to ${nextDuration / 1000 / 60} min. ` +
        `Next Groq probe at ${new Date(nextRetryTimestamp).toISOString()}. ` +
        `Falling back to OpenRouter.`
    );

    await setGroqCooldownState(nextRetryTimestamp, nextDuration);

    // Fallback — transparent to the caller
    return callOpenRouter(messages);
  }
}
