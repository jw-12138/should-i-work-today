export interface OffDay {
  date: string
  isOffDay: boolean
  name?: string
}

export interface HolidayResponse {
  days: OffDay[]
}

export interface RequestedDate {
  timestamp: number
  day: string
  text: string
}

export interface RequestTime {
  text: string
  timestamp: number
}

export interface ApiResponseV1 {
  requestTime: RequestTime
  requestedDate: RequestedDate
  todayIs: string
  shouldIWorkToday: boolean
  desc: string
}

export interface ApiResponseV2 {
  requestedDate: RequestedDate
  shouldIWorkToday: boolean
}

