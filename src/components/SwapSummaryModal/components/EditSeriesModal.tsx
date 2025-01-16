import type { Row } from '../useRows'
import type { Group } from '@/api/arteli'
import type { RemoveRec } from '@/hooks/useRemoveRecs'
import type { FilterParams } from '@/store/FiltersContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import CategoriesFilter from '@/components/CategoriesFilter'
import ConfirmModal from '@/components/ConfirmModal'
import GroupSearch from '@/components/GroupSearch'
import LoadMoreButton from '@/components/LoadMoreButton'
import { useAllRelevantSubcategories } from '@/hooks/arteli'
import { useFilters } from '@/hooks/useFilters'
import { useRemoveRecs } from '@/hooks/useRemoveRecs'
import { RecItem } from '../RecItem'
import { useSwap } from '../useSwap'

export type Filters = Omit<FilterParams, 'storeIds'>

const LIMIT = 5

const messages = defineMessages({
  title: { defaultMessage: 'Edit the Remove Series', id: 'o9MZKx' },
  confirm: { defaultMessage: 'Confirm Swap', id: 'Y2RZkn' },
  delete: { defaultMessage: 'Delete Series', id: 'sH/2RD' },
  current: { defaultMessage: 'Current Selection', id: 'tZ1kBG' },
  other: { defaultMessage: 'Other Recommendations', id: 'uH7tU8' },
  placeholder: { defaultMessage: 'Search Series', id: 'FL8WrT' },
  loading: { defaultMessage: 'Loading...', id: 'gjBiyj' },
  empty: { defaultMessage: 'No other recommendations found', id: 'o+OMr7' },
  newValue: { defaultMessage: 'New value', id: 'MF2Jri' }
})

export const EditSeriesModal = ({ data, open, onClose }: { data?: Row; open: boolean; onClose: () => void }) => {
  const [limit, setLimit] = useState(LIMIT)
  const [selected, setSelected] = useState<Row | undefined>()
  const { categoryId, subcategoryIds } = useFilters()
  const [filters, setFilters] = useState<Filters>({ categoryId, subcategoryIds })
  const [groupIds, setGroupIds] = useState<Group['id'][] | null>(null)
  const { replaceItem, includeRecentlyAddedGroups } = useSwap()
  const { data: subcategories } = useAllRelevantSubcategories({ enabled: open })
  const allRemovalSubcategoriesSelected = Boolean(
    !!filters.categoryId &&
      subcategories
        ?.filter(({ categoryIds }) => categoryIds.includes(filters.categoryId!))
        .every(({ id }) => filters.subcategoryIds.includes(id))
  )

  useEffect(() => {
    if (open) return

    setSelected(undefined)
  }, [open])

  const preventSwap = filters.subcategoryIds.length > 1 && !allRemovalSubcategoriesSelected

  const { data: rows, isFetching } = useRemoveRecs({
    categoryId: filters.categoryId!,
    subcategoryIds: filters.subcategoryIds,
    storeIds: data ? [data.store.id] : [],
    groupIds: groupIds ?? undefined,
    enabled: open,
    includeRecentlyAddedGroups
  })

  const recs = useMemo(() => {
    const distinctValues: number[] = []
    const distinctRows: RemoveRec[] = []

    const filteredRows = rows.filter((row) => row.group?.id !== data?.group?.id)

    for (const filteredRow of filteredRows) {
      const predictedSales = filteredRow.recGroup?.predictedSales
      if (predictedSales && !distinctValues.includes(predictedSales)) {
        distinctValues.push(predictedSales)
        distinctRows.push(filteredRow)
      }
    }

    return distinctRows
  }, [data, rows])

  const limitedRows = useMemo(() => recs.slice(0, limit), [recs, limit])
  const hasNextPage = recs.length > limit

  const handleClose = useCallback(() => onClose(), [onClose])

  const handleDelete = useCallback(() => {
    if (data?.group) {
      setSelected({ store: data.store, note: data.note, clearance: data.clearance })
    }
  }, [data])

  const handleConfirm = useCallback(() => {
    if (selected && data) {
      replaceItem(data!.store.id, selected)
      handleClose()
    }
  }, [data, handleClose, replaceItem, selected])

  return (
    <ConfirmModal
      title={
        <Typography fontSize={20} fontWeight="bold">
          <FormattedMessage {...messages.title} />
        </Typography>
      }
      description={
        <Typography fontSize={16} fontWeight="bold">
          {data?.store.externalId + ' ' + data?.store.name}
        </Typography>
      }
      open={open}
      onClose={handleClose}
      onCancel={handleDelete}
      onConfirm={preventSwap ? undefined : handleConfirm}
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      cancelLabel={<FormattedMessage {...messages.delete} />}
      size="large"
      topMargin={3}
      inverted
      hideSkipButton={Boolean(selected) || preventSwap}
      hideConfirmButton={!selected}
    >
      <Typography fontSize={18} mb={1}>
        <FormattedMessage {...messages.current} />
      </Typography>
      {data && (
        <RecItem
          active
          name={data.group?.externalId}
          pastSales={data.recGroup?.pastSales}
          predictedSales={data.recGroup?.predictedSales}
          productFlags={data.recGroup?.productFlagsAny}
          gutterBottom
          tags={data.recGroup?.productTagsAny}
        />
      )}
      {selected && (
        <Box sx={({ spacing }) => ({ mb: spacing(6) })}>
          <Typography fontSize={18} mb={1}>
            <FormattedMessage {...messages.newValue} />
          </Typography>
          <RecItem
            active
            name={selected.group?.externalId}
            pastSales={selected.recGroup?.pastSales}
            predictedSales={selected.recGroup?.predictedSales}
            productFlags={selected.recGroup?.productFlagsAny}
            tags={selected.recGroup?.productTagsAny}
          />
        </Box>
      )}
      {!selected && (
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
                      gutterBottom
                      name={rec.group?.externalId}
                      pastSales={rec.recGroup?.pastSales}
                      predictedSales={rec.recGroup?.predictedSales}
                      productFlags={rec.recGroup?.productFlagsAny}
                      onClick={
                        preventSwap
                          ? undefined
                          : () =>
                              setSelected({
                                ...data!,
                                recGroup: rec.recGroup,
                                group: rec.group,
                                filters: {
                                  categoryId: filters.categoryId,
                                  subcategoryId: allRemovalSubcategoriesSelected ? filters.subcategoryIds[0] : null
                                }
                              })
                      }
                      tags={rec.recGroup?.productTagsAny}
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
      )}
    </ConfirmModal>
  )
}
