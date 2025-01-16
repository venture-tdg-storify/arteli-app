import { useCallback, useMemo, useRef, useState } from 'react'
import Icon from '@mui/material/Icon'
import { styled } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { type Group } from '@/api/arteli'
import ProductImage from '@/components/ProductImage'
import RecommendationStores from '@/components/RecommendationStores'
import SidePanel from '@/components/SidePanel'
import { useTagList } from '@/hooks/useTagList'
import Notes from '../Notes'
import GroupNameWithFlags from './GroupNameWithFlags'
import { useRecommendationDetails } from './useRecommendationDetails'
import { useRecommendationStores } from './useRecommendationStores'

const Container = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(2, 2, 0, 2),
  overflow: 'auto'
}))

function a11yProps(index: number) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const messages = defineMessages({
  seriesDetails: { defaultMessage: 'Series Details', id: 'FuiCG6' },
  storeInformation: { defaultMessage: 'Store Information', id: 'OiLgb1' },
  notes: { defaultMessage: 'Notes', id: '7+Domh' }
})

export function GroupDetailsPanel() {
  const { groupId = '', tab = '' } = useParams<{ groupId: Group['id']; tab?: string }>()
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(tab === 'notes' ? 1 : 0)
  const { formatMessage: t } = useIntl()

  const {
    addRecGroup,
    group,
    products,
    imageUrls,
    productIds,
    isFetching: isFetchingRecs
  } = useRecommendationDetails({ groupId })

  const { allStoresMap, isFetching: isFetchingStores } = useRecommendationStores({ productIds })

  const clearanceAndSale = useMemo(
    () => allStoresMap.filter(({ clearance, actionType }) => clearance && actionType === 'Remove', [allStoresMap]),
    [allStoresMap]
  )
  const clearance = useMemo(
    () => allStoresMap.filter(({ clearance, actionType }) => clearance && actionType === 'Add', [allStoresMap]),
    [allStoresMap]
  )

  const allProductFlags = useMemo(() => products?.map((_) => _.flags) ?? [], [products])

  const { tagsList } = useTagList({ tags: addRecGroup?.productTagsAny })

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onExit = useCallback(() => {
    navigate({ pathname: '../', search: location.search })
  }, [navigate])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const ref = useRef<HTMLDivElement>(null)

  const isFetching = isFetchingRecs || isFetchingStores

  if (!addRecGroup || !group) return null

  return (
    <SidePanel
      onClose={onClose}
      onExit={onExit}
      title={<FormattedMessage {...messages.seriesDetails} />}
      open={open}
      ref={ref}
    >
      <Container>
        <ProductImage img={imageUrls?.[0]} height={160} />
        <GroupNameWithFlags
          name={group.name}
          flags={allProductFlags}
          clearance={clearance.length}
          clearanceAndSale={clearanceAndSale.length}
          tags={tagsList}
        />
        <Tabs value={activeTab} onChange={handleChange} aria-label="action tabs" sx={{ marginTop: 2 }}>
          <Tab
            icon={<Icon className="fa-location-dot" />}
            iconPosition="start"
            label={t(messages.storeInformation)}
            sx={{ minHeight: 48, height: 48 }}
            {...a11yProps(0)}
          />
          <Tab
            icon={<Icon className="fa-note" />}
            iconPosition="start"
            label={t(messages.notes)}
            sx={{ minHeight: 48, height: 48 }}
            {...a11yProps(1)}
          />
        </Tabs>
        {activeTab === 0 && <RecommendationStores stores={allStoresMap} isFetching={isFetching} />}
        {activeTab === 1 && <Notes groupId={groupId} />}
      </Container>
    </SidePanel>
  )
}
