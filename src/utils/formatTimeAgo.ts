export type RelativeTimeFormatUnitSingular =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'

export type RelativeTime = { value: number; unit: RelativeTimeFormatUnitSingular }

const DIVISIONS: RelativeTime[] = [
  { value: 60, unit: 'second' },
  { value: 60, unit: 'minute' },
  { value: 24, unit: 'hour' },
  { value: 7, unit: 'day' },
  { value: 4.34524, unit: 'week' },
  { value: 12, unit: 'month' },
  { value: Number.POSITIVE_INFINITY, unit: 'year' }
]

export function formatTimeAgo(date: string | Date): RelativeTime {
  let duration = (new Date(date).getTime() - Date.now()) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.value) {
      return { value: Math.round(duration), unit: division.unit }
    }
    duration /= division.value
  }

  return { value: duration, unit: 'second' }
}
