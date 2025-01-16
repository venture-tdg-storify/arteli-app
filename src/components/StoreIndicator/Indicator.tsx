// import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { FormattedNumber } from 'react-intl'

export const Indicator: React.FC<{ value?: number | null }> = ({ value = null }) => {
  return (
    <Stack
      justifyContent="flex-start"
      sx={({ palette }) => ({
        // color: value > 0 ? 'rgba(39, 165, 113, 1)' : 'rgba(250, 95, 105, 1)',
        fontSize: 14,
        fontWeight: 'normal',
        color: palette.text.secondary
        // marginLeft: spacing(1)
      })}
    >
      {value !== null ? (
        <FormattedNumber value={value} style="currency" maximumFractionDigits={0} currency="USD" />
      ) : (
        '-'
      )}
      {/* <Icon sx={{ mr: 1, fontSize: 14 }}>
        {value > 0 ? <Icon className="fa-arrow-trend-up" /> : <Icon className="fa-arrow-trend-down" />}
      </Icon> */}
    </Stack>
  )
}
