import { useCallback, useState } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { FormattedMessage, defineMessages } from 'react-intl'
import analytics from '@/utils/analytics'

const messages = defineMessages({
  expandAll: { defaultMessage: 'Expand All', id: 'EgZZHp' },
  collapseAll: { defaultMessage: 'Collapse All', id: 'bz6UVJ' }
})

const StyledButton = styled(Button)<{ expanded: number }>(({ theme: { palette }, expanded }) => ({
  '&.MuiButton-outlined': {
    border: `1px solid ${palette.divider}`,
    backgroundColor: expanded ? palette.background.bar : palette.background.default
  }
}))

export function CollapseSection({
  children,
  onExpand,
  onCollapse,
  disabled = false,
  gutterBottom = true
}: {
  children?: React.ReactNode
  onExpand?: () => void
  onCollapse?: () => void
  disabled?: boolean
  gutterBottom?: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  const handleExpandAll = useCallback(() => {
    if (onExpand) {
      setExpanded(true)
      analytics?.track('Expand All clicked')
      onExpand()
    }
  }, [onExpand])

  const handleCollapseAll = useCallback(() => {
    if (onCollapse) {
      setExpanded(false)
      analytics?.track('Collapse All clicked')
      onCollapse()
    }
  }, [onCollapse])

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={gutterBottom ? 1 : 0}>
      <ButtonGroup color="primary" disabled={disabled} size="small">
        <StyledButton onClick={handleExpandAll} expanded={Number(expanded)}>
          <FormattedMessage {...messages.expandAll} />
        </StyledButton>
        <StyledButton onClick={handleCollapseAll} expanded={Number(!expanded)}>
          <FormattedMessage {...messages.collapseAll} />
        </StyledButton>
      </ButtonGroup>
      {children}
    </Stack>
  )
}
