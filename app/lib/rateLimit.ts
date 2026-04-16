import redisClient from "./redis";

interface RateLimitConfig {
  /** Max number of requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSec: number;
}

interface RateLimitResult {
  /** Whether the request is allowed through */
  allowed: boolean;
  /** How many requests are left in the current window */
  remaining: number;
  /** How many seconds until the window resets */
  resetIn: number;
}

export interface RateLimitStatus {
  /** How many requests are left in the current window */
  remaining: number;
  /** The total daily limit */
  limit: number;
  /** How many seconds until the window resets (0 if no window active) */
  resetIn: number;
}

/**
 * Read-only gate — checks whether the IP is still under the limit WITHOUT
 * incrementing the counter. Use this at the top of a route to reject
 * already-exhausted callers before doing any work.
 *
 * Call `consumeRateLimit` later, only when you're ready to charge a use
 * (e.g. after confirming the response didn't come from cache).
 */
export async function checkRateLimit(
  ip: string,
  routeTag: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { limit, windowSec } = config;
  const key = `rl:${routeTag}:${ip}`;

  const [countRaw, ttl] = await Promise.all([
    redisClient.get(key),
    redisClient.ttl(key),
  ]);

  const count = countRaw ? parseInt(countRaw, 10) : 0;
  const allowed = count < limit;
  const remaining = Math.max(0, limit - count);
  const resetIn = ttl > 0 ? ttl : windowSec;

  return { allowed, remaining, resetIn };
}

/**
 * Increments the counter for the given IP + route, setting a TTL on the
 * first request of a window. Call this only after a real LLM response
 * (i.e. not a cache hit) to avoid burning quota unnecessarily.
 */
export async function consumeRateLimit(
  ip: string,
  routeTag: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { limit, windowSec } = config;
  const key = `rl:${routeTag}:${ip}`;

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, windowSec);
  }

  const ttl = await redisClient.ttl(key);

  const allowed = count <= limit;
  const remaining = Math.max(0, limit - count);
  const resetIn = ttl > 0 ? ttl : windowSec;

  return { allowed, remaining, resetIn };
}

/**
 * Read-only rate limit status — does NOT increment the counter.
 * Safe to call from UI-facing status endpoints.
 *
 * @param ip        - The caller's IP address
 * @param routeTag  - A short label for the route, e.g. "ai-action" or "ai-pvp"
 * @param config    - { limit, windowSec }
 */
export async function getRateLimitStatus(
  ip: string,
  routeTag: string,
  config: { limit: number; windowSec: number }
): Promise<RateLimitStatus> {
  const key = `rl:${routeTag}:${ip}`;

  const [countRaw, ttl] = await Promise.all([
    redisClient.get(key),
    redisClient.ttl(key),
  ]);

  const count = countRaw ? parseInt(countRaw, 10) : 0;
  const remaining = Math.max(0, config.limit - count);
  const resetIn = ttl > 0 ? ttl : 0;

  return { remaining, limit: config.limit, resetIn };
}
