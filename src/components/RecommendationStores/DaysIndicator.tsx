import { useMemo } from 'react'
import Stack from '@mui/material/Stack'
import dayjs from 'dayjs'
import { FormattedNumber } from 'react-intl'

export const DaysIndicator: React.FC<{ value: string }> = ({ value }) => {
  const daysOnFloor = useMemo(() => {
    const current = dayjs()
    const onFloor = dayjs(value)

    return current.diff(onFloor, 'day')
  }, [value])

  return (
    <Stack
      justifyContent="flex-start"
      sx={({ palette }) => ({
        fontSize: 14,
        fontWeight: 'normal',
        color: palette.text.secondary
      })}
    >
      <FormattedNumber value={daysOnFloor} />
    </Stack>
  )
}
