import type { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { FormattedDate, FormattedMessage, defineMessages } from 'react-intl'
import { EmptySummary } from './EmptySummary'
import { Indicator } from './Indicator'
import { Overline } from './Overline'

const Action = styled('div')(() => ({
  marginLeft: 'auto'
}))

type SummaryProps = {
  children?: ReactNode
  total: number
  count: number
  predictedImpact: number
  isFetching: boolean
  title: ReactNode
  label: ReactNode
  emptyTitle: ReactNode
  emptyDescription?: ReactNode
  countIcon?: string
  updatedAt?: string
  additionAction?: ReactNode
}

const messages = defineMessages({
  totalEstimatedImpact: { defaultMessage: 'Total Estimated Impact', id: 'e0BRiO' },
  lastChange: { defaultMessage: 'Last change', id: 'FN9w+6' }
})

export const Summary: FC<SummaryProps> = ({
  children,
  total,
  count,
  predictedImpact,
  isFetching,
  title,
  label,
  emptyTitle,
  emptyDescription,
  countIcon = 'fa-sparkles',
  updatedAt,
  additionAction
}) => {
  if (!total && !isFetching)
    return (
      <EmptySummary title={emptyTitle} subtitle={emptyDescription} additionAction={additionAction}>
        {children}
      </EmptySummary>
    )

  return (
    <Stack
      sx={({ palette, spacing }) => ({
        height: 128,
        border: `1px solid ${palette.divider}`,
        borderRadius: spacing(1),
        marginBottom: spacing(3),
        padding: spacing(2)
      })}
      direction="column"
      alignItems="flex-start"
    >
      <Stack alignItems="flex-end" sx={{ width: '100%' }}>
        <Typography
          sx={({ typography }) => ({ fontSize: 20, fontWeight: typography.fontWeightBold, mr: 1 })}
          component="div"
        >
          {title}
        </Typography>
        {updatedAt && (
          <Typography sx={({ palette }) => ({ color: palette.text.secondary, fontSize: 12 })}>
            <FormattedMessage {...messages.lastChange} /> <FormattedDate value={new Date()} />
          </Typography>
        )}
        <Box sx={{ marginLeft: 'auto' }}>{additionAction}</Box>
      </Stack>

      <Stack direction="row" justifyContent="flex-start" width="100%">
        <Overline label={label} icon={countIcon}>
          <Typography sx={({ palette }) => ({ fontSize: 16, fontWeight: 'bold', color: palette.text.secondary })}>
            {count}
          </Typography>
        </Overline>
        <Overline label={<FormattedMessage {...messages.totalEstimatedImpact} />} icon="fa-calculator" variant="gray">
          <Typography
            sx={({ palette }) => ({ fontSize: 16, fontWeight: 'bold', color: palette.text.secondary })}
            component="div"
          >
            <Indicator value={predictedImpact} />
          </Typography>
        </Overline>
        <Action>{children}</Action>
      </Stack>
    </Stack>
  )
}
