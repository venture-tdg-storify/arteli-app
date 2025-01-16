import { type ReactNode } from 'react'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

export const Property = ({
  children,
  divider = false,
  checked,
  onChange,
  disabled = false
}: {
  children: ReactNode
  divider?: boolean
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) => {
  return (
    <>
      {divider && <Divider sx={({ palette }) => ({ my: 1, borderColor: palette.grey[100] })} />}
      <Stack>
        <Typography>{children}</Typography>
        <Switch
          checked={checked}
          onChange={(_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            onChange(checked)
          }}
          disabled={disabled}
        />
      </Stack>
    </>
  )
}
