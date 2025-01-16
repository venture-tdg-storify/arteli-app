import type { ReactNode } from 'react'
import React from 'react'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const Badge = styled('div')(({ theme }) => ({
  width: theme.spacing(5.5),
  height: theme.spacing(5.5),
  borderRadius: '50%',
  marginRight: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

export const Overline: React.FC<{
  children: ReactNode
  label: ReactNode
  icon?: string
  variant?: 'gray' | 'gradient'
}> = ({ label, children, icon, variant = 'gradient' }) => {
  return (
    <Stack justifyContent="flex-start" sx={{ mr: 4 }} alignItems="flex-end">
      {icon && (
        <Badge
          sx={(theme) => ({
            background:
              variant === 'gradient'
                ? 'linear-gradient(161.85deg, #DAF87E 13.36%, #D1F5FE 76.96%)'
                : theme.palette.background.bar
          })}
        >
          <Icon
            className={icon}
            sx={({ palette }) => ({
              color: variant === 'gradient' ? 'black' : palette.text.primary
            })}
          />
        </Badge>
      )}
      <Stack direction="column" alignItems="flex-start">
        {children}
        <Typography variant="overline" sx={{ textTransform: 'capitalize', color: '#748497', lineHeight: 1.5 }}>
          {label}
        </Typography>
      </Stack>
    </Stack>
  )
}
