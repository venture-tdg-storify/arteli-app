import React from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const ErrorText = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}))

export const ErrorMessage: React.FC<{ children: React.ReactNode; action?: React.ReactNode }> = ({
  children,
  action
}) => {
  return (
    <ErrorText>
      <Typography variant="h6">{children}</Typography>
      {action}
    </ErrorText>
  )
}
