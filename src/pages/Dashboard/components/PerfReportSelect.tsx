import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useMatch, useNavigate } from 'react-router-dom'
import { PATH_HOME, PATH_SERIES_REPORT } from '@/routes'

const messages = defineMessages({
  overallPerformance: { id: 'hyoRm2', defaultMessage: 'Overall Performance' },
  seriesPerformance: { id: 'VMJn6f', defaultMessage: 'Series Performance' }
})

export const PerfReportSelect = () => {
  const navigate = useNavigate()

  const defaultValue = useMatch(`${PATH_HOME}/${PATH_SERIES_REPORT}`) ? 'series' : 'overall'

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value !== defaultValue) {
      navigate(event.target.value === 'overall' ? '..' : './series-report')
    }
  }

  return (
    <Select defaultValue={defaultValue} onChange={handleChange} size="small">
      <MenuItem value="overall">
        <FormattedMessage {...messages.overallPerformance} />
      </MenuItem>
      <MenuItem value="series">
        <FormattedMessage {...messages.seriesPerformance} />
      </MenuItem>
    </Select>
  )
}
