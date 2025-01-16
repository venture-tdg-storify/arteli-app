import type { ActionType, Group, Store } from '@/api/types.generated'
import type { AddRecGroupRow, Filters } from '@/pages/Plan/components/EditSwap/useSearchAddRecommendations'
import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import CategoriesFilter from '@/components/CategoriesFilter'
import GroupSearch from '@/components/GroupSearch'
import LoadMoreButton from '@/components/LoadMoreButton'
import { RecItem } from '@/components/SwapSummaryModal/RecItem'
import { useSearchAddRecommendations } from '@/pages/Plan/components/EditSwap/useSearchAddRecommendations'
import { useRemoveRecommendations } from './useRemoveRecommendations'

const LIMIT = 5

const messages = defineMessages({
  other: { defaultMessage: 'Other Recommendations', id: 'uH7tU8' },
  loading: { defaultMessage: 'Loading...', id: 'gjBiyj' },
  empty: { defaultMessage: 'No other recommendations found', id: 'o+OMr7' }
})

export const Recs = ({
  groupId,
  storeId,
  onSelect,
  filters,
  setFilters,
  preventSwap,
  actionType
}: {
  groupId?: Group['id']
  storeId: Store['id']
  onSelect: (value: AddRecGroupRow) => void
  filters: Filters
  setFilters: (value: Filters) => void
  preventSwap: boolean
  actionType: ActionType
}) => {
  const [groupIds, setGroupIds] = useState<Group['id'][] | null>(null)
  const [limit, setLimit] = useState(LIMIT)

  const queryHook = actionType === 'Add' ? useSearchAddRecommendations : useRemoveRecommendations

  const { rows, isFetching } = queryHook({
    filters,
    ids: [storeId],
    searchGroupIds: groupIds || undefined,
    filterValues: true
  })

  const recs = useMemo(() => {
    const distinctValues: number[] = []
    const distinctRows = []

    const filteredRows = rows.filter((row) => row.group?.id !== groupId)

    for (const filteredRow of filteredRows) {
      const predictedSales = filteredRow.addRecGroup?.predictedSalesSumOverFilteredAddableStores
      if (predictedSales && !distinctValues.includes(predictedSales)) {
        distinctValues.push(predictedSales)
        distinctRows.push(filteredRow)
      }
    }

    return distinctRows
  }, [groupId, rows])

  const limitedRows = useMemo(() => recs.slice(0, limit), [recs, limit])
  const hasNextPage = recs.length > limit

  return (
    <>
      <Box sx={({ spacing }) => ({ mt: spacing(4) })}>
        <CategoriesFilter
          onChange={setFilters}
          categoryId={filters.categoryId!}
          subcategoryIds={filters.subcategoryIds}
          fullWidth
        />
      </Box>
      <Box sx={({ spacing }) => ({ mt: spacing(0) })}>
        <GroupSearch onSetId={setGroupIds} isFetchingRecs={isFetching} />
      </Box>
      <div>
        <Typography fontSize={18}>
          <FormattedMessage {...messages.other} />
        </Typography>
        {limitedRows.length > 0 && (
          <Box sx={{ height: 'calc(100vh - 550px)', overflow: 'auto', width: '100%' }}>
            <List sx={{ width: '100%' }} dense>
              {limitedRows.map((rec) => (
                <RecItem
                  key={rec.group?.id}
                  name={rec.group?.externalId}
                  pastSales={rec.addRecGroup?.pastSalesSumOverFilteredAddableStores}
                  predictedSales={rec.addRecGroup?.predictedSalesSumOverFilteredAddableStores}
                  productFlags={rec.addRecGroup?.productFlagsAny}
                  gutterBottom
                  onClick={preventSwap ? undefined : () => onSelect(rec)}
                  tags={rec.addRecGroup?.productTagsAny}
                />
              ))}
              <LoadMoreButton
                onLoadMore={() => setLimit((prev) => prev + LIMIT)}
                hasMore={hasNextPage}
                isFetching={isFetching}
              />
            </List>
          </Box>
        )}
        {limitedRows.length === 0 && (
          <Typography textAlign="center" py={6}>
            <FormattedMessage {...(isFetching ? messages.loading : messages.empty)} />
          </Typography>
        )}
      </div>
    </>
  )
}
