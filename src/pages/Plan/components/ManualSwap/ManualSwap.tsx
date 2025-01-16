import type { Row } from './useRows'
import type { Category, Group, Store, Subcategory } from '@/api/types.generated'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import CategoryFilters from '@/components/CategoriesFilter'
import { ConfirmButtons } from '@/components/ConfirmModal'
import GroupSearch from '@/components/GroupSearch'
import LoadMoreButton from '@/components/LoadMoreButton'
import Modal from '@/components/Modal'
import StoresFilter from '@/components/StoresFilter'
import { RecItem } from '@/components/SwapSummaryModal/RecItem'
import { useFilters } from '@/hooks/useFilters'
import { useRows } from './useRows'

const messages = defineMessages({
  title: { defaultMessage: 'Add Series to Plan', id: 'B//qjF' },
  series: { defaultMessage: 'Series', id: 'ORsvNl' },
  note: {
    defaultMessage: 'Note: stores that already have this series on the floor will not be added to the plan.',
    id: '4/QOr6'
  },
  back: { defaultMessage: 'Back', id: 'cyR7Kh' },
  cancel: { defaultMessage: 'Cancel', id: '47FYwb' },
  addSeries: { defaultMessage: 'Add Series', id: 'fYYsfL' },
  selectCategory: { id: 'IkXLzZ', defaultMessage: 'Select Category' },
  selectStores: { id: 'Pj1Gsw', defaultMessage: 'Select Store(s)' }
})

const LIMIT = 10

export const ManualSwap = () => {
  const navigate = useNavigate()
  const { categoryId, subcategoryIds, storeIds, setParams } = useFilters()
  const [selected, setSelected] = useState<Row>()
  const [groupIds, setGroupIds] = useState<Group['id'][]>([])
  const [limit, setLimit] = useState(LIMIT)
  const ref = useRef<HTMLSpanElement>(null)

  const handleClose = useCallback(() => {
    navigate('../')
  }, [navigate])

  const handleConfirm = useCallback(() => {
    if (!selected) return

    navigate(`../${selected.group.id}/swap`, {
      state: { storeIds: selected.storeIds, includeRecentlyAddedGroups: true }
    })
  }, [navigate, selected])

  const handleChangeStore = useCallback(
    (storeIds: Store['id'][]) => {
      setSelected(undefined)
      setParams({ storeIds })
    },
    [setSelected, setParams]
  )

  const handleChangeCategory = useCallback(
    ({ categoryId, subcategoryIds }: { categoryId: Category['id'] | null; subcategoryIds: Subcategory['id'][] }) => {
      setParams({ categoryId, subcategoryIds })
      setSelected(undefined)
    },
    [setSelected, setParams]
  )

  const handleGroupSearch = useCallback(
    (groupIds: Group['id'][] | null) => {
      if (groupIds === null) {
        setSelected(undefined)
        setGroupIds([])
        return
      }

      setGroupIds(groupIds)
    },
    [setSelected]
  )

  const handleCancel = useCallback(() => {
    if (selected) {
      ref.current?.click()
      setSelected(undefined)
    } else {
      handleClose()
    }
  }, [selected, handleClose])

  const { rows, isFetching } = useRows({ storeIds, categoryId: categoryId!, subcategoryIds, groupIds })

  const limitedRows = useMemo(() => rows.slice(0, limit), [rows, limit])

  useEffect(() => {
    if (limitedRows.length === 1) {
      setSelected(rows[0])
    }
  }, [limitedRows.length, setSelected, rows])

  const hasNextPage = rows.length > limit

  return (
    <Modal
      title={<FormattedMessage {...messages.title} />}
      description={null}
      open={true}
      onClose={handleClose}
      size="large"
    >
      <Box sx={{ mt: 2 }}>
        <CategoryFilters
          onChange={handleChangeCategory}
          categoryId={categoryId!}
          subcategoryIds={subcategoryIds}
          fullWidth
          showErrors={false}
          inputLabel={messages.selectCategory}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <StoresFilter
          onChange={handleChangeStore}
          storeIds={storeIds}
          fullWidth
          showErrors={false}
          inputLabel={messages.selectStores}
        />
      </Box>
      <GroupSearch onSetId={handleGroupSearch} isFetchingRecs={isFetching} ref={ref} />

      {limitedRows.length > 0 && (
        <Typography fontSize={18} mt={1}>
          <FormattedMessage {...messages.series} />
        </Typography>
      )}
      {selected && (
        <Box sx={{ mt: 3, mb: 4 }}>
          <RecItem
            name={selected.group?.externalId}
            pastSales={selected.pastSales}
            predictedSales={selected.predictedSales}
            productFlags={selected.productFlagsAny}
            groupId={selected.group?.id}
            tags={selected.productTagsAny}
            active
          />
          <Typography mt={4}>
            <FormattedMessage {...messages.note} />
          </Typography>
        </Box>
      )}
      {limitedRows.length > 0 && !selected && (
        <Box sx={{ height: 'calc(100vh - 630px)', overflow: 'auto', width: '100%', mt: 2 }}>
          <List sx={{ width: '100%' }} dense>
            {limitedRows.map((row) => (
              <RecItem
                key={row.group?.id}
                groupId={row.group?.id}
                name={row.group?.externalId}
                pastSales={row.pastSales}
                predictedSales={row.predictedSales}
                productFlags={row.productFlagsAny}
                tags={row.productTagsAny}
                gutterBottom
                onClick={() => setSelected(row)}
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
      <ConfirmButtons
        onCancel={handleCancel}
        onConfirm={selected ? handleConfirm : undefined}
        cancelLabel={<FormattedMessage {...(selected ? messages.back : messages.cancel)} />}
        confirmLabel={<FormattedMessage {...messages.addSeries} />}
        inverted
      />
    </Modal>
  )
}
