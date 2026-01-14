import type { Redis } from '@upstash/redis/cloudflare'
import type { ApiResponseV1 } from '../types'
import { dayMap } from '../constants'
import { getRealTime, addZero, getRandomSentence } from '../utils'
import { getOffDays } from '../services/holiday'

export async function makeResponseV1(redis: Redis | null, type?: string): Promise<ApiResponseV1> {
  console.log('getting time ...')
  const time = getRealTime(type)

  const dateObj = time.dateObj
  const timestamp = dateObj.getTime()

  const fullYear = dateObj.getFullYear()
  const day = dateObj.getDay()

  console.log('getting off days ...')
  const offDays = await getOffDays(redis, fullYear)

  const today =
    dateObj.getFullYear() + '-' + addZero(dateObj.getMonth() + 1) + '-' + addZero(dateObj.getDate())

  let todayIsOffDay: boolean | null = null
  offDays.forEach((offDay) => {
    if (offDay.date === today) {
      todayIsOffDay = offDay.isOffDay
    }
  })

  let resText = ''
  let shouldIWork = false

  if (todayIsOffDay === null) {
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
      console.log('weekend')
      resText = 'weekend'
      shouldIWork = false
    } else {
      console.log('weekday')
      resText = 'weekday'
      shouldIWork = true
    }
  } else if (typeof todayIsOffDay === 'boolean') {
    if (todayIsOffDay) {
      console.log('off day, should be home')
      resText = 'off_day'
      shouldIWork = false
    } else {
      console.log('not off day, should be at work')
      resText = 'not_off_day'
      shouldIWork = true
    }
  }

  return {
    requestTime: {
      text: new Date().toLocaleString('zh-CN'),
      timestamp: Date.now()
    },
    requestedDate: {
      timestamp: timestamp,
      day: dayMap[day],
      text: time.datetime
    },
    todayIs: resText,
    shouldIWorkToday: shouldIWork,
    desc: getRandomSentence(shouldIWork)
  }
}
