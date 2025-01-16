import type { GridContextParams } from './GridContext'
import type { ActionStore, Group, Store } from '@/api/types.generated'
import type { ActionStoreRow, ActionStoreStatus } from '@/hooks/useActionStoreRowsQuery'
import { useMemo } from 'react'
import { groupById } from '@arteli/utils'
import { filterObject, groupByPropertyMulti, mapObject, unique } from '@/utils'

export type TreeNode = {
  id: string
  children: TreeNode[]
  type: 'store' | 'action'
}

export const useGridContextValue = (rows: readonly ActionStoreRow[]): GridContextParams => {
  const { storesById, groupsById, actionStoresById, storeImpact, storeStatues, addActionsCountByStoreId } =
    useMemo(() => {
      const stores = unique(rows.map((_) => _.store))
      const groups = unique(rows.map((_) => _.group))
      const actionStores = unique(rows.map((_) => _.actionStore))
      const storeStatuses = rows
        .map((_) => ({ status: _.status, storeId: _.store.id }))
        .filter((_) => Boolean(_.status))

      const storesById = groupById<Store>(stores)
      const groupsById = groupById<Group>(groups)
      const actionStoresById = groupById<ActionStore>(actionStores)

      const actionStoresByStoreId = groupByPropertyMulti<ActionStore, 'storeId'>(actionStores, 'storeId')
      const storeStatusesByStoreId = groupByPropertyMulti(storeStatuses, 'storeId')

      const storeImpact = mapObject(actionStoresByStoreId, (actionStores) =>
        actionStores.length > 0
          ? actionStores.reduce((acc, _) => acc + (_!.predictedSales ?? 0) * (_!.actionType === 'Add' ? 1 : -1), 0)
          : null
      )

      const storeStatues = filterObject(
        mapObject(
          storeStatusesByStoreId,
          (storeStatuses) => storeStatuses.map((_) => _.status).filter(Boolean) as ActionStoreStatus[]
        ),
        (statuses) => statuses.length > 0
      )

      const addActionsCountByStoreId = mapObject(
        actionStoresByStoreId,
        (actionStores) => actionStores.filter((_) => _.actionType === 'Add').length
      )

      return { storesById, groupsById, actionStoresById, storeImpact, storeStatues, addActionsCountByStoreId }
    }, [rows])

  const value = useMemo(
    () => ({
      storesById,
      groupsById,
      actionStoresById,
      storeImpact,
      storeStatues,
      addActionsCountByStoreId
    }),
    [actionStoresById, addActionsCountByStoreId, groupsById, storeImpact, storeStatues, storesById]
  )

  return value
}
