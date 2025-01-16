import type { ReactNode } from 'react'
import React from 'react'
import Drawer from '@mui/material/Drawer'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

interface SidePanelProps {
  children: React.ReactNode
  onClose: () => void
  onExit?: () => void
  title: ReactNode
  open?: boolean
  ref?: React.Ref<HTMLDivElement>
  size?: 'small' | 'medium' | 'large'
  zIndex?: number
}

const headerHeight = 56

const Base = styled('div', { name: 'SidePanel' })(({ theme: { palette } }) => ({
  background: palette.background.paper
}))

const Header = styled('div', { name: 'SidePanel-header' })(({ theme: { palette, spacing, typography } }) => ({
  height: headerHeight,
  background: palette.background.bar,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: spacing(0, 2),
  fontSize: spacing(2.5),
  color: palette.text.secondary,
  fontWeight: typography.fontWeightLight
}))

const Content = styled('div', { name: 'Content' })(() => ({
  height: `calc(100vh - ${headerHeight}px)`,
  overflowY: 'auto',
  scrollBehavior: 'smooth'
}))

export const SidePanel = React.forwardRef(
  (
    { children, title, onClose, open = true, onExit, size = 'medium', zIndex: customZIndex }: SidePanelProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <Drawer
        open={open}
        anchor="right"
        role="complementary"
        aria-hidden={!open}
        onClose={onClose}
        onTransitionExited={onExit}
        sx={({ sizes, spacing, zIndex }) => {
          const width =
            sizes.drawer.width + { small: -parseInt(spacing(10)), medium: 0, large: +parseInt(spacing(10)) }[size]

          return {
            zIndex: customZIndex ?? zIndex.drawer,
            '& .MuiPaper-root': {
              top: 0,
              width,
              maxWidth: width,
              height: '100vh',
              borderLeft: 'none'
            }
          }
        }}
      >
        <Base>
          <Header>
            {title}
            <IconButton
              onClick={onClose}
              sx={({ typography }) => ({ fontWeight: typography.fontWeightLight })}
              aria-label={`Close`}
            >
              <Icon className="fa-xmark" />
            </IconButton>
          </Header>
          <Content ref={ref}>{children}</Content>
        </Base>
      </Drawer>
    )
  }
)
