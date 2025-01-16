import type { Dayjs } from 'dayjs'
import { State } from '@arteli/state'
import dayjs from 'dayjs'

type DateRange = {
  from: Dayjs
  to: Dayjs
  minDate?: Dayjs
  generatedAt: Dayjs | null
}

export const dateRange = new State<DateRange>({
  from: dayjs().subtract(3, 'months'),
  to: dayjs(),
  generatedAt: null
})
