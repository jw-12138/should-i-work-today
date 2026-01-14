import type { Redis } from '@upstash/redis/cloudflare'
import type { ApiResponseV2 } from '../types'
import { dayMap } from '../constants'
import { getRealTime, addZero } from '../utils'
import { getOffDays } from '../services/holiday'

export async function makeResponseV2(redis: Redis | null, type?: string): Promise<ApiResponseV2> {
  const time = getRealTime(type)

  const dateObj = time.dateObj
  const timestamp = dateObj.getTime()

  const fullYear = dateObj.getFullYear()
  const day = dateObj.getDay()

  const offDays = await getOffDays(redis, fullYear)

  const today =
    dateObj.getFullYear() + '-' + addZero(dateObj.getMonth() + 1) + '-' + addZero(dateObj.getDate())

  let todayIsOffDay: boolean | null = null
  offDays.forEach((offDay) => {
    if (offDay.date === today) {
      todayIsOffDay = offDay.isOffDay
    }
  })

  let shouldIWork = false

  if (todayIsOffDay === null) {
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
      shouldIWork = false
    } else {
      shouldIWork = true
    }
  } else if (typeof todayIsOffDay === 'boolean') {
    shouldIWork = !todayIsOffDay
  }

  return {
    requestedDate: {
      timestamp: timestamp,
      day: dayMap[day],
      text: time.datetime
    },
    shouldIWorkToday: shouldIWork
  }
}
