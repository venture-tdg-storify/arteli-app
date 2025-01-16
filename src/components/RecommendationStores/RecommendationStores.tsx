import type { StoreRow } from '@/pages/Recs/components/GroupDetailsPanel/useRecommendationStores'
import { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Icon from '@mui/material/Icon'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import ClearanceIcon from '@/components/ClearanceIcon'
import Indicator from '@/components/StoreIndicator'
import { Overline } from '@/components/StoreOverline/Overline'
import { useFilters } from '@/hooks/useFilters'
import analytics from '@/utils/analytics'
import { commonMessages } from '@/utils/messages'
import { DaysIndicator } from './DaysIndicator'

const messages = defineMessages({
  storeInformation: { defaultMessage: 'Store Information', id: 'OiLgb1' },
  onFloor: { defaultMessage: 'Total days on floor:', id: 'XAHyVk' },
  showAllStores: { defaultMessage: 'Show all Stores', id: 'qeoY2S' },
  emptyList: { defaultMessage: 'This series is not on the floor at any stores.', id: 'pbVqn+' }
})

export const RecommendationStores = ({ stores, isFetching }: { stores?: StoreRow[]; isFetching?: boolean }) => {
  const { formatMessage } = useIntl()
  const [showAll, setShowAll] = useState(false)
  const { storeIds } = useFilters()

  const storesToShow = useMemo(
    () => (showAll ? stores : (stores ?? []).filter(({ actionType }) => actionType === 'Remove')),
    [showAll, stores]
  )

  const handleShowAll = useCallback(() => {
    analytics?.track('Show All Stores Clicked')
    setShowAll(!showAll)
  }, [showAll])

  if (!stores) return null

  return (
    <>
      <Stack pt={1} alignItems="center" justifyContent="flex-end">
        <FormControlLabel
          control={<Switch value={showAll} checked={showAll} onChange={handleShowAll} />}
          label={<FormattedMessage {...messages.showAllStores} />}
          labelPlacement="start"
          componentsProps={{ typography: { fontSize: 14 } }}
        />
      </Stack>
      <Box sx={{ overflow: 'auto', width: '100%' }}>
        <List sx={{ width: '100%' }} dense disablePadding>
          {storesToShow?.map(({ store, clearance, actionType, pastSales, floorDate }) => (
            <ListItem
              disableGutters
              key={store.id}
              sx={{ backgroundColor: storeIds.length === 1 && store.id === storeIds[0] ? '#daf87e66' : 'transparent' }}
            >
              <ListItemAvatar sx={{ minWidth: 32 }}>
                <Icon className="fa-location-dot" sx={{ fontSize: 20 }} />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{
                  style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }
                }}
                secondaryTypographyProps={{
                  sx: ({ palette }) => ({ color: palette.text.quaternary }),
                  component: 'div'
                }}
                primary={
                  <>
                    <Typography sx={{ fontSize: 14, marginRight: 0.4, fontWeight: 'bold' }} component="span">
                      {store.externalId}
                    </Typography>
                    {store.name}
                  </>
                }
                secondary={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    role="region"
                    aria-label="store-info"
                  >
                    <Stack width={240} justifyContent="start" alignItems="center" spacing={1}>
                      <Overline label={formatMessage(commonMessages.pastSales90Days) + ':'} direction="row">
                        <Indicator value={pastSales} />
                      </Overline>
                      {clearance && <ClearanceIcon clearanceAndSale={actionType === 'Remove'} />}
                    </Stack>
                    {floorDate && actionType === 'Remove' && (
                      <Overline label={<FormattedMessage {...messages.onFloor} />} direction="row">
                        <DaysIndicator value={floorDate} />
                      </Overline>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          ))}
          {!storesToShow?.length && !isFetching && (
            <ListItem sx={{ padding: 12 }}>
              <ListItemText
                primary={<FormattedMessage {...messages.emptyList} />}
                primaryTypographyProps={{
                  style: { textAlign: 'center' }
                }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </>
  )
}
