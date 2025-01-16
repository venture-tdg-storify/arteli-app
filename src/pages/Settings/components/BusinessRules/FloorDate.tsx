import type { MessageDescriptor } from 'react-intl'
import { useCallback } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { FormattedMessage } from 'react-intl'

export const FloorDate = ({
  title,
  subtitle,
  valueDescription,
  value,
  onChange
}: {
  title: MessageDescriptor
  subtitle: MessageDescriptor
  valueDescription: MessageDescriptor
  value: number
  onChange: (_: number) => void
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = event.target.value
      if (v && v !== '0') {
        onChange(Number(v))
      }
    },
    [onChange]
  )
  return (
    <Stack direction="row" spacing={1} alignItems="end" justifyContent="space-between" mt={6}>
      <Stack direction="column" alignItems="start">
        <Typography sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 20 })}>
          <FormattedMessage {...title} />
        </Typography>
        <Typography>
          <FormattedMessage {...subtitle} />
        </Typography>
      </Stack>
      <TextField
        type="number"
        id="floor-date"
        name="floor-date"
        size="small"
        value={value}
        onChange={handleChange}
        sx={{ maxWidth: 130, pt: 1 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <FormattedMessage {...valueDescription} />
              </InputAdornment>
            )
          },
          htmlInput: { min: 1, step: 1 }
        }}
      />
    </Stack>
  )
}
