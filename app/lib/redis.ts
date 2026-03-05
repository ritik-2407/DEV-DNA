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
