import type { ReactNode } from 'react'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export const Overline: React.FC<{
  children: ReactNode
  label: ReactNode
  variant?: 'gray' | 'gradient'
  spacing?: number
  direction?: 'column' | 'row'
}> = ({ label, children, spacing = 4, direction = 'column' }) => {
  return (
    <Stack justifyContent="flex-start" sx={{ mr: spacing }} alignItems="flex-end">
      <Stack
        direction={direction}
        alignItems={direction === 'column' ? 'flex-start' : 'baseline'}
        spacing={direction === 'row' ? 1 : 0}
      >
        <Typography variant="overline" sx={{ textTransform: 'capitalize', color: '#748497', lineHeight: 1.5 }}>
          {label}
        </Typography>
        {children}
      </Stack>
    </Stack>
  )
}
