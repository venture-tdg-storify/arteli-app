import type { ActionStore, ActionType, Product, Store } from '@/api/types.generated'
import type { AddRecGroupRow, Filters } from '@/pages/Plan/components/EditSwap/useSearchAddRecommendations'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import api from '@/api'
import ConfirmModal from '@/components/ConfirmModal'
import DeleteSeriesModal from '@/components/DeleteSeriesModal'
import { ProductSelection } from '@/components/ProductsSelection'
import { useRows } from '@/components/ProductsSelection/useRows'
import { RecItem } from '@/components/SwapSummaryModal/RecItem'
import { useAllRelevantSubcategories, useGroupQuery } from '@/hooks/arteli'
import { toast } from '@/store/notifications'
import { commonMessages } from '@/utils/messages'
import { actionStoreToProductFlags } from '@/utils/productFlags'
import { Recs } from './Recs'

const useUpdateActionStoreMutation = api.Arteli.ActionStores.update.asMutation()

const getParams = (actionStore: ActionStore) => ({
  categoryId: actionStore.categoryId,
  subcategoryId: actionStore.subcategoryId,
  groupId: actionStore.groupId
})

const messages = defineMessages({
  title: { defaultMessage: 'Edit the {type} Series', id: 'OJsVhE' },
  confirm: { defaultMessage: 'Confirm Swap', id: 'Y2RZkn' },
  delete: { defaultMessage: 'Delete Series', id: 'sH/2RD' },
  current: { defaultMessage: 'Current Selection', id: 'tZ1kBG' },
  newValue: { defaultMessage: 'New value', id: 'MF2Jri' }
})

export const EditSwapModal = ({
  action,
  addActionStore,
  removeActionStore,
  store
}: {
  action: ActionType
  addActionStore: ActionStore
  removeActionStore: ActionStore | null
  store: Store
}) => {
  const queryClient = useQueryClient()
  const isAdd = action === 'Add'
  const navigate = useNavigate()
  const actionStore = isAdd ? addActionStore : removeActionStore
  const [selected, setSelected] = useState<AddRecGroupRow | undefined>()
  const [deleteModal, setDeleteModal] = useState(false)
  const [productIds, setProductIds] = useState<Product['id'][]>([])
  const [filters, setFilters] = useState<Filters>({
    categoryId: actionStore?.categoryId ?? addActionStore.categoryId,
    subcategoryIds: actionStore?.subcategoryId
      ? [actionStore.subcategoryId]
      : addActionStore.subcategoryId
        ? [addActionStore.subcategoryId]
        : []
  })
  const { formatMessage: t } = useIntl()

  const { data: group } = useGroupQuery({
    params: { id: actionStore?.groupId ?? '' },
    enabled: Boolean(actionStore?.groupId)
  })

  const onClose = useCallback(() => {
    navigate('..')
  }, [navigate])

  const { data: subcategories } = useAllRelevantSubcategories()

  const allSubcategoriesSelected = useMemo(() => {
    const categoryId = filters.categoryId

    if (!categoryId) return false

    return subcategories
      ?.filter(({ categoryIds }) => categoryIds.includes(categoryId))
      .every(({ id }) => filters.subcategoryIds.includes(id))
  }, [subcategories, filters.categoryId, filters.subcategoryIds])

  const preventSwap = useMemo(
    () => filters.subcategoryIds.length > 1 && !allSubcategoriesSelected,
    [allSubcategoriesSelected, filters]
  )

  useEffect(() => {
    if (filters.subcategoryIds.length !== 0 || !subcategories?.length) return

    const categoryId = filters.categoryId

    if (!categoryId) return

    setFilters((prev) => ({
      ...prev,
      subcategoryIds: subcategories.filter(({ categoryIds }) => categoryIds.includes(categoryId)).map((_) => _.id)
    }))
  }, [subcategories, setFilters, filters])

  const { mutate: updateActionStore, isPending } = useUpdateActionStoreMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['action-sets', 'active'] })
      await queryClient.invalidateQueries({ queryKey: ['rows', 'action-stores'] })
      await queryClient.invalidateQueries({ queryKey: ['filtered-ids', 'action-stores'] })
    },
    onSuccess: () => {
      onClose()
    },
    onError: (error) => {
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const handleBackClick = selected ? () => setSelected(undefined) : undefined

  const handleConfirm = useCallback(() => {
    if (isAdd) {
      if (!selected) return

      updateActionStore({
        params: { id: addActionStore.id },
        body: {
          storeId: addActionStore.storeId,
          actionType: 'Add',
          note: addActionStore.note,
          categoryId: filters.categoryId!,
          productIds,
          subcategoryId: allSubcategoriesSelected ? null : filters.subcategoryIds[0]!,
          groupId: selected.group!.id,
          swap: removeActionStore ? getParams(removeActionStore) : null
        }
      })
    } else {
      updateActionStore({
        params: { id: addActionStore.id },
        body: {
          storeId: addActionStore.storeId,
          actionType: 'Add',
          note: addActionStore.note,
          ...getParams(addActionStore),
          productIds: addActionStore.productIds,
          swap: selected
            ? {
                categoryId: filters.categoryId!,
                subcategoryId: allSubcategoriesSelected ? null : filters.subcategoryIds[0]!,
                groupId: selected.group!.id
              }
            : null
        }
      })
    }
  }, [
    isAdd,
    selected,
    updateActionStore,
    addActionStore,
    filters.categoryId,
    filters.subcategoryIds,
    productIds,
    allSubcategoriesSelected,
    removeActionStore
  ])

  const handleChangeProducts = useCallback((productIds: readonly Product['id'][]) => {
    setProductIds([...productIds])
  }, [])

  const storeIds = useMemo(
    () => selected?.addRecGroup.filteredAddableStores.map((_) => _.storeId) ?? [],
    [selected?.addRecGroup.filteredAddableStores]
  )

  return (
    <ConfirmModal
      title={
        <Typography fontSize={20} fontWeight="bold">
          <FormattedMessage {...messages.title} values={{ type: action }} />
        </Typography>
      }
      description={
        <Typography fontSize={16} fontWeight="bold">
          {store.externalId + ' ' + store.name}
        </Typography>
      }
      open
      onClose={onClose}
      onCancel={() => setDeleteModal(true)}
      onConfirm={preventSwap ? undefined : handleConfirm}
      onBack={handleBackClick}
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      cancelLabel={<FormattedMessage {...messages.delete} />}
      size="large"
      topMargin={3}
      inverted
      hideSkipButton={isAdd || Boolean(selected) || group === undefined || preventSwap}
    >
      <Typography fontSize={18} mb={1}>
        <FormattedMessage {...messages.current} />
      </Typography>
      <RecItem
        name={group?.name}
        pastSales={actionStore?.pastSales}
        predictedSales={actionStore?.predictedSales ?? undefined}
        productFlags={actionStoreToProductFlags(actionStore)}
        gutterBottom
        active
        tags={actionStore?.productTagsAny}
      />
      {selected && (
        <Box sx={({ spacing }) => ({ mb: spacing(6) })}>
          <Typography fontSize={18} mb={1}>
            <FormattedMessage {...messages.newValue} />
          </Typography>
          <RecItem
            name={selected.group?.externalId}
            pastSales={selected.addRecGroup.pastSalesSumOverFilteredAddableStores}
            predictedSales={selected.addRecGroup.predictedSalesSumOverFilteredAddableStores}
            productFlags={selected.addRecGroup.productFlagsAny}
            active
            tags={selected.addRecGroup.productTagsAny}
          />
          {isAdd && (
            <>
              <Divider sx={({ spacing }) => ({ my: spacing(3) })} />
              <Box sx={{ width: '100%', height: 'calc(100vh - 550px)' }}>
                <ProductSelection
                  value={productIds}
                  onChange={handleChangeProducts}
                  categoryId={filters.categoryId!}
                  subcategoryIds={filters.subcategoryIds}
                  groupId={selected.group.id}
                  storeIds={storeIds}
                  dataFetcher={useRows}
                />
              </Box>
            </>
          )}
        </Box>
      )}
      {!selected && (
        <Recs
          actionType={action}
          groupId={actionStore?.groupId}
          storeId={store.id}
          onSelect={setSelected}
          filters={filters}
          setFilters={setFilters}
          preventSwap={preventSwap}
        />
      )}
      <DeleteSeriesModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </ConfirmModal>
  )
}
