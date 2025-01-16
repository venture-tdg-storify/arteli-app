import type { GridContextParams } from './GridContext'
import type { ActionStore, Store, Category, ActionCompletionStatus } from '@/api/types.generated'
import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import { useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import { groupByPropertyMulti, mapObject, unique } from '@/utils'

export type TreeNode = {
  id: string
  children: TreeNode[]
  type: 'store' | 'action'
}

export const useGridContextValue = ({ rows }: { rows: readonly ActionStoreRow[] }): GridContextParams => {
  const [categoryExternalIds, setCategoryExternalIds] = useState<Category['externalId'][]>([])
  const [selectedCategoryExternalIds, setSelectedCategoryExternalIds] = useState<Category['externalId'][]>([])

  const [actionCompletionStatuses, setActionCompletionStatuses] = useState<ActionCompletionStatus[]>([])
  const [selectedActionCompletionStatuses, setSelectedActionCompletionStatuses] = useState<ActionCompletionStatus[]>([])

  const {
    storesById,
    predictedSalesByStoreId,
    addActionsCountByStoreId,
    swapStatusesByStoreId,
    groupsById,
    actionStoresById
  } = useMemo(() => {
    const stores = unique(rows.map((_) => _.store))
    const actionStores = unique(rows.map((_) => _.actionStore))

    const storesById = groupById<Store>(stores)

    const actionStoresByStoreId = groupByPropertyMulti<ActionStore, 'storeId'>(actionStores, 'storeId')

    const predictedSalesByStoreId = mapObject(actionStoresByStoreId, (actionStores) =>
      actionStores.length > 0
        ? actionStores.reduce((acc, _) => acc + (_!.predictedSales ?? 0) * (_!.actionType === 'Add' ? 1 : -1), 0)
        : null
    )

    const addActionsCountByStoreId = mapObject(
      actionStoresByStoreId,
      (actionStores) => actionStores.filter((_) => _.actionType === 'Add').length
    )

    const swapStatusesByStoreId = mapObject(actionStoresByStoreId, (actionStores) =>
      unique(actionStores.map((_) => _.completionStatus))
    )

    return {
      storesById,
      predictedSalesByStoreId,
      addActionsCountByStoreId,
      swapStatusesByStoreId,
      groupsById: groupById(rows.map((_) => _.group)),
      actionStoresById: groupById(actionStores)
    }
  }, [rows])

  return useMemo(
    () => ({
      storesById,
      predictedSalesByStoreId,
      addActionsCountByStoreId,
      swapStatusesByStoreId,
      categoryExternalIds,
      setCategoryExternalIds,
      setSelectedCategoryExternalIds,
      selectedCategoryExternalIds,
      actionCompletionStatuses,
      setActionCompletionStatuses,
      selectedActionCompletionStatuses,
      setSelectedActionCompletionStatuses,
      actionStoresById,
      groupsById
    }),
    [
      storesById,
      predictedSalesByStoreId,
      addActionsCountByStoreId,
      swapStatusesByStoreId,
      categoryExternalIds,
      selectedCategoryExternalIds,
      actionCompletionStatuses,
      selectedActionCompletionStatuses,
      actionStoresById,
      groupsById
    ]
  )
}
