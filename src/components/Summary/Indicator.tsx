import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { FormattedNumber } from 'react-intl'

export const Indicator: React.FC<{ value?: number }> = ({ value = 0 }) => {
  return (
    <Stack
      justifyContent="flex-start"
      sx={() => ({
        color: value > 0 ? 'rgba(39, 165, 113, 1)' : 'rgba(250, 95, 105, 1)',
        fontSize: 14,
        fontWeight: value > 0 ? 'bold' : 'normal'
      })}
    >
      <Icon sx={{ mr: 1, fontSize: 14 }}>
        {value > 0 ? <Icon className="fa-arrow-trend-up" /> : <Icon className="fa-arrow-trend-down" />}
      </Icon>
      <FormattedNumber value={value} style="currency" maximumFractionDigits={0} currency="USD" />
    </Stack>
  )
}
