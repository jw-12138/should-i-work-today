import { Redis } from '@upstash/redis/cloudflare'

export function createRedis(env: { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }

  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  })
}

export async function getCache<T>(redis: Redis, key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (e) {
    console.error('Cache get error:', e)
    return null
  }
}

export async function setCache(
  redis: Redis,
  key: string,
  value: unknown,
  ttlSeconds: number = 3600
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch (e) {
    console.error('Cache set error:', e)
  }
}
