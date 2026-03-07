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
