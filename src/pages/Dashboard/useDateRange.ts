import type { Dayjs } from 'dayjs'
import { useContext, createContext } from 'react'

export const useDateRange = () => {
  const dateRange = useContext(DateRangeContext)

  return dateRange
}

interface IDateRangeContext {
  from: Dayjs | null
  to: Dayjs | null
  setFrom: (date: Dayjs | null) => void
  setTo: (date: Dayjs | null) => void
}

export const DateRangeContext = createContext<IDateRangeContext>({} as IDateRangeContext)
