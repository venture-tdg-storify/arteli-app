import type { Dayjs } from 'dayjs'
import { useCallback } from 'react'
import Stack from '@mui/material/Stack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

// TODO: Move to /components
export const DateRangePicker = ({
  from,
  to,
  onFromChange,
  onToChange,
  disableFuture = false,
  disablePast = false,
  minDate
}: {
  from: Dayjs | null
  to: Dayjs | null
  onFromChange: (from: Dayjs | null) => void
  onToChange: (to: Dayjs | null) => void
  disableFuture?: boolean
  disablePast?: boolean
  minDate?: Dayjs
}) => {
  const handleChangeFrom = useCallback(
    (from: Dayjs | null) => {
      onFromChange(from?.startOf('day') ?? null)
    },
    [onFromChange]
  )

  const handleChangeTo = useCallback(
    (to: Dayjs | null) => {
      onToChange(to?.endOf('day') ?? null)
    },
    [onToChange]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={1} sx={{ ml: 1 }}>
        <DatePicker
          value={from}
          onChange={handleChangeFrom}
          minDate={minDate}
          maxDate={to ?? undefined}
          disableFuture={disableFuture}
          disablePast={disablePast}
          slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
        />
        <DatePicker
          value={to}
          onChange={handleChangeTo}
          minDate={from ?? undefined}
          disableFuture={disableFuture}
          disablePast={disablePast}
          slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
        />
      </Stack>
    </LocalizationProvider>
  )
}
