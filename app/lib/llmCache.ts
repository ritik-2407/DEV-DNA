import redisClient from "./redis"

const CACHE_TTL = 3600 // 1 hour in seconds (Redis uses seconds, not milliseconds)

export async function getCachedLLM(key: string) {
  const cached = await redisClient.get(key)
  if (!cached) return null

  return JSON.parse(cached)
}

export async function setCachedLLM(key: string, data: any) {
  await redisClient.set(key, JSON.stringify(data), { EX: CACHE_TTL })
}
