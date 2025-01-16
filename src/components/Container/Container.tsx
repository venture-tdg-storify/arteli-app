import type { ReactNode } from 'react'
import React from 'react'
import { styled } from '@mui/material/styles'

interface ContainerProps {
  children: ReactNode
}

const Base = styled('div', { name: 'Container' })(({ theme: { sizes, spacing } }) => ({
  paddingRight: spacing(9),
  marginRight: 0,
  paddingLeft: spacing(9),
  height: `calc(100vh - ${sizes.page.offset + 1}px)`,
  overflowY: 'auto',
  paddingBottom: spacing(2)
}))

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <Base>{children}</Base>
}
