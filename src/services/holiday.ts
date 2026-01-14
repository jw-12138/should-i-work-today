import type { Redis } from '@upstash/redis/cloudflare'
import type { OffDay, HolidayResponse } from '../types'
import { getCache, setCache } from './cache'

const HOLIDAY_API_BASE = 'https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/'
const CACHE_TTL = 3600 // 1 hour

async function fetchHolidayData(year: number): Promise<OffDay[]> {
  const response = await fetch(HOLIDAY_API_BASE + year + '.json')

  if (response.status !== 200) {
    throw new Error(`获取${year}年节假日失败`)
  }

  const data = (await response.json()) as HolidayResponse
  return data.days
}

export async function getOffDays(redis: Redis | null, year: number): Promise<OffDay[]> {
  const nextYear = year + 1
  const cacheKey = `holiday:${year}:${nextYear}`

  // 尝试从缓存获取
  if (redis) {
    const cached = await getCache<OffDay[]>(redis, cacheKey)
    if (cached) {
      console.log('Cache hit:', cacheKey)
      return cached
    }
    console.log('Cache miss:', cacheKey)
  } else {
    console.log('Redis not configured, skipping cache')
  }

  // 从 GitHub 获取数据
  const thisYearDays = await fetchHolidayData(year)
  const nextYearDays = await fetchHolidayData(nextYear)
  const allDays = thisYearDays.concat(nextYearDays)

  // 写入缓存
  if (redis) {
    await setCache(redis, cacheKey, allDays, CACHE_TTL)
  }

  return allDays
}
