import type { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  overdueDate: { defaultMessage: 'Execution Due Date', id: 'By26hC' }
})

export const OverdueDatePicker = ({
  overdueDate,
  onChange
}: {
  overdueDate: Dayjs
  onChange: (date: Dayjs | null) => void
}) => {
  const { formatMessage: t } = useIntl()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={t(messages.overdueDate)}
        defaultValue={overdueDate}
        minDate={dayjs().startOf('day').add(1, 'day')}
        onChange={(_) => onChange(_)}
        sx={{ mt: 3, width: '100%' }}
      />
    </LocalizationProvider>
  )
}
