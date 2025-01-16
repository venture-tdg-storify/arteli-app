import type { GridContextParams } from './GridContext'
import type { Group, Store } from '@/api/types.generated'
import { useMemo } from 'react'
import { groupById, groupByProperty } from '@arteli/utils'
import { groupByHashMulti, mapObject, unique } from '@/utils'
import { getSwapImpact, type Row } from './useRows'

export const useGridContextValue = (rows: readonly Row[]): GridContextParams => {
  const value = useMemo(() => {
    const stores = unique(rows.map((_) => _.store))
    const groups = rows.map((_) => _.group).filter((group) => group !== undefined)
    const clearance = rows.map(({ clearance, store }) => ({ clearance, storeId: store.id }))

    const storesById = groupById<Store>(stores)
    const groupsById = groupById<Group>(groups)
    const clearanceByStoreId = groupByProperty(clearance, 'storeId')

    const clearanceStatus = mapObject(clearanceByStoreId, ({ clearance }) => clearance)

    const swapImpact = mapObject(
      groupByHashMulti(rows, (row) => row.store.id),
      ([row]) => getSwapImpact(row)
    )

    return { storesById, groupsById, clearanceStatus, swapImpact }
  }, [rows])

  return value
}
