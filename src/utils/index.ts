import { at_work_sentences, at_home_sentences } from '../constants'

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomSentence(shouldWork: boolean): string {
  if (shouldWork) {
    const random_index = getRandomInt(0, at_work_sentences.length - 1)
    return at_work_sentences[random_index]
  } else {
    const random_index = getRandomInt(0, at_home_sentences.length - 1)
    return at_home_sentences[random_index]
  }
}

export function addZero(num: number): string {
  if (num < 10) {
    return '0' + num
  }
  return String(num)
}

export function getRealTime(type?: string): { datetime: string; dateObj: Date } {
  const now = new Date()

  // 计算 GMT+8 时间
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
  const gmt8Time = utcTime + 8 * 60 * 60000
  const dateObj = new Date(gmt8Time)

  if (type === 'tomorrow') {
    dateObj.setDate(dateObj.getDate() + 1)
  }

  return {
    datetime: dateObj.toLocaleString('zh-CN'),
    dateObj
  }
}
