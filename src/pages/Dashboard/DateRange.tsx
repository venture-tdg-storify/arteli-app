import type { Dayjs } from 'dayjs'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { DateRangeContext } from './useDateRange'

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const [from, setFrom] = useState<Dayjs | null>(null)
  const [to, setTo] = useState<Dayjs | null>(null)

  const values = useMemo(() => ({ from, to, setFrom, setTo }), [from, to])

  return <DateRangeContext.Provider value={values}>{children}</DateRangeContext.Provider>
}
