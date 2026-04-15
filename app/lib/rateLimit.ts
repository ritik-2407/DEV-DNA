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
 * IP-based rate limiter using Redis INCR + EXPIRE.
 *
 * Strategy (Fixed Window):
 *   - On each request, INCR a key like `rl:<routeTag>:<ip>`
 *   - On the *first* request in a window, set the key to expire after `windowSec`
 *   - If the count exceeds `limit`, deny the request
 *
 * @param ip        - The caller's IP address (used as the unique identifier)
 * @param routeTag  - A short label for the route, e.g. "ai-action" or "github-profile"
 * @param config    - { limit, windowSec }
 */
export async function rateLimit(
  ip: string,
  routeTag: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { limit, windowSec } = config;
  const key = `rl:${routeTag}:${ip}`;

  // INCR atomically increments the counter and creates the key if it doesn't exist.
  // If the key is new (count === 1) we set its TTL so it auto-expires after the window.
  const count = await redisClient.incr(key);

  if (count === 1) {
    // First request in this window — set the expiry
    await redisClient.expire(key, windowSec);
  }

  // Fetch the remaining TTL so we can report it back in the response headers
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
