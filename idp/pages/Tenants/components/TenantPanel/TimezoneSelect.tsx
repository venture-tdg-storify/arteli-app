import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { FormattedMessage, defineMessages } from 'react-intl'
import { timezones } from './timezones'

const messages = defineMessages({
  timeZone: { defaultMessage: 'Time Zone', id: 'jGWq1h' }
})

export function TimezoneSelect({ timezone, onChange }: { timezone?: string; onChange: (timezone: string) => void }) {
  return (
    <Autocomplete
      autoFocus
      openOnFocus
      fullWidth
      disabled={!timezones.length}
      options={timezones}
      disableClearable
      onChange={(_, value) => {
        if (!value) return

        onChange(value)
      }}
      value={timezone}
      renderInput={(params) => <TextField {...params} label={<FormattedMessage {...messages.timeZone} />} />}
    />
  )
}
