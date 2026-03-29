import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redisClient: ReturnType<typeof createClient> | undefined;
};

const redisClient =
  globalForRedis.redisClient ?? createClient({ url: process.env.REDIS_URL });

if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redisClient;
}

export default redisClient;

// ---------------------------------------------------------------------------
// Groq fallback cooldown state helpers
// Keys: groq:cooldown:nextRetry  (unix ms timestamp as string)
//       groq:cooldown:duration   (cooldown duration in ms as string)
// ---------------------------------------------------------------------------

const KEY_NEXT_RETRY = "groq:cooldown:nextRetry";
const KEY_DURATION   = "groq:cooldown:duration";

// 1 hour in ms — starting cooldown value
export const INITIAL_COOLDOWN_MS = 60 * 60 * 1000;
// Hard cap at 24 hours
export const MAX_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export interface GroqCooldownState {
  nextGroqRetry: number; // unix ms — 0 means "no cooldown active"
  cooldownDuration: number; // current duration in ms
}

/** Read the current Groq cooldown state from Redis. */
export async function getGroqCooldownState(): Promise<GroqCooldownState> {
  const [nextRetryRaw, durationRaw] = await Promise.all([
    redisClient.get(KEY_NEXT_RETRY),
    redisClient.get(KEY_DURATION),
  ]);

  return {
    nextGroqRetry: nextRetryRaw ? parseInt(nextRetryRaw, 10) : 0,
    cooldownDuration: durationRaw
      ? parseInt(durationRaw, 10)
      : INITIAL_COOLDOWN_MS,
  };
}

/** Persist a new cooldown window to Redis (keys expire automatically after 25 h). */
export async function setGroqCooldownState(
  nextGroqRetry: number,
  cooldownDuration: number
): Promise<void> {
  // TTL slightly longer than the max cooldown so Redis auto-cleans them
  const ttlSeconds = Math.ceil(MAX_COOLDOWN_MS / 1000) + 3600;

  await Promise.all([
    redisClient.set(KEY_NEXT_RETRY, String(nextGroqRetry), { EX: ttlSeconds }),
    redisClient.set(KEY_DURATION, String(cooldownDuration), { EX: ttlSeconds }),
  ]);
}

/** Clear cooldown state when Groq is healthy again. */
export async function clearGroqCooldownState(): Promise<void> {
  await Promise.all([
    redisClient.del(KEY_NEXT_RETRY),
    redisClient.del(KEY_DURATION),
  ]);
}
