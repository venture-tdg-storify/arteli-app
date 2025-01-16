import type { Group } from '@/api/arteli'
import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { PATH_BUSINESS_MONITOR } from '@/routes'
import Overline from '../../StoreOverline'
import { useTopPredictedSales } from '../useTopPredictedSales'

const messages = defineMessages({
  title: { defaultMessage: 'Swap Summary', id: 'bEbP3/' },
  addSeries: { defaultMessage: 'Add Series', id: 'fYYsfL' },
  storeCount: { defaultMessage: 'Store Count', id: 'AzAroF' },
  predictedSales: { defaultMessage: 'Predicted Sales', id: 'erj0Av' },
  opportunityCost: { defaultMessage: 'Opportunity Cost', id: 'EyLC+K' },
  topSingle: { defaultMessage: 'Highest Revenue Selected', id: 'zPvuFF' },
  topMulti: { defaultMessage: 'The top revenue series was selected', id: 'bbe4tR' },
  otherMulti: { defaultMessage: 'The top revenue series was not selected', id: 'UAV4SV' }
})

const ExpandIcon = styled('div')(({ expanded }: { expanded: boolean }) => ({
  cursor: 'pointer',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  display: 'inline-block'
}))

export const Header = ({
  group,
  noOfStores,
  predictedSales,
  isMulti,
  children,
  expanded,
  handleExpand
}: {
  group: Group
  noOfStores: number
  predictedSales: number
  isMulti: boolean
  children: React.ReactNode
  expanded: boolean
  handleExpand: () => void
}) => {
  // const navigate = useNavigate()
  // const { state } = useLocation()
  // const { storeIds = [] } = state ?? {}
  const { topPredictedSales, isFetching } = useTopPredictedSales()

  const opportunityCost = useMemo(() => {
    if (topPredictedSales === undefined || isFetching) return null

    const cost = predictedSales - topPredictedSales
    const isTop = Math.abs(Math.round(cost)) === 0

    return (
      <Typography variant="body1" color={isTop ? 'success' : 'error'}>
        {isMulti && isTop && <FormattedMessage {...messages.topMulti} />}
        {isMulti && !isTop && <FormattedMessage {...messages.otherMulti} />}
        {!isMulti && isTop && <FormattedMessage {...messages.topSingle} />}
        {!isMulti && !isTop && (
          <FormattedNumber value={cost} style="currency" maximumFractionDigits={0} currency="USD" />
        )}
      </Typography>
    )
  }, [isFetching, isMulti, predictedSales, topPredictedSales])

  // const handleOpenBusinessMonitor = useCallback(() => {
  //   navigate(`./${PATH_BUSINESS_MONITOR}`, { state: { storeIds } })
  // }, [navigate, storeIds])

  return (
    <Box
      sx={({ palette, spacing }) => ({
        border: `1px solid ${palette.divider}`,
        borderRadius: spacing(1),
        paddingX: spacing(3),
        backgroundColor: palette.background.paper,
        height: expanded ? 360 : 'auto'
        // maxHeight: 'calc(100vh - 200px)',
      })}
    >
      <Stack sx={() => ({ height: 84, width: '100%' })} direction="row" alignItems="center" justifyContent="start">
        <Typography sx={({ typography }) => ({ fontSize: 24, fontWeight: typography.fontWeightBold, pr: 8 })}>
          <FormattedMessage {...messages.title} />
        </Typography>
        <Overline label={<FormattedMessage {...messages.addSeries} />} spacing={2} direction="column">
          <Typography variant="body1">{group.externalId}</Typography>
        </Overline>
        <Overline label={<FormattedMessage {...messages.storeCount} />} spacing={2} direction="column">
          <Typography variant="body1">{noOfStores}</Typography>
        </Overline>
        <Overline label={<FormattedMessage {...messages.predictedSales} />} spacing={2} direction="column">
          <Typography variant="body1">
            <FormattedNumber
              // value={items.reduce((acc, item) => acc + (item.addRecGroupPredictedSales ?? 0), 0)}
              value={predictedSales}
              style="currency"
              maximumFractionDigits={0}
              currency="USD"
            />
          </Typography>
        </Overline>
        <Overline label={<FormattedMessage {...messages.opportunityCost} />} spacing={2} direction="column">
          {opportunityCost}
        </Overline>
        <ExpandIcon expanded={expanded} onClick={handleExpand} sx={{ ml: 'auto' }} data-testid="expand-icon">
          <Icon className="fa-chevron-down" sx={{ fontSize: 25 }} />
        </ExpandIcon>
      </Stack>
      {expanded && children}
    </Box>
  )
}
