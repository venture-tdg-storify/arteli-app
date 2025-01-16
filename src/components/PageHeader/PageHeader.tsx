import { type ReactNode, type MouseEventHandler, useEffect } from 'react'
import Fab from '@mui/material/Fab'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import analytics from '@/utils/analytics'
import { GlobalLoader } from './GlobalLoader'

interface PageHeaderProps {
  children?: ReactNode
  subTitle?: ReactNode
  title: string
  onBack?: MouseEventHandler
  note?: ReactNode
  withSpaceBetween?: boolean
}

const Base = styled('div', { name: 'PageHeader' })(({ theme: { sizes, spacing, zIndex, palette } }) => ({
  height: sizes.pageHeader.height - 1,
  padding: spacing(3, 9),
  position: 'fixed',
  top: sizes.header.height + 1,
  zIndex: zIndex.appBar - 1,
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: palette.background.default,
  marginRight: 0,
  paddingRight: spacing(9)
}))

const Placeholder = styled('div')(({ theme: { sizes } }) => ({
  height: sizes.pageHeader.height
}))

export const PageHeader: React.FC<PageHeaderProps> = ({ children, subTitle, title, onBack }) => {
  useDocumentTitle(title)

  useEffect(() => {
    analytics?.page(title)
  }, [title])

  return (
    <>
      <GlobalLoader />
      <Base>
        {Boolean(onBack) && (
          <Fab
            sx={(theme) => ({ marginRight: 2, backgroundColor: theme.palette.background.paper })}
            onClick={onBack}
            size="medium"
          >
            <Icon className="fa-arrow-left" />
          </Fab>
        )}
        <Stack direction="column" alignItems="flex-start">
          <Typography
            component="h1"
            variant="h4"
            sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 30, marginBottom: 1 })}
          >
            {title}
          </Typography>
          {subTitle}
        </Stack>
        {children ? children : null}
      </Base>
      <Placeholder aria-hidden />
    </>
  )
}
