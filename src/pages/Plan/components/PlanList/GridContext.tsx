import type { ActionStore, Group, Store } from '@/api/arteli'
import type { ActionStoreStatus } from '@/hooks/useActionStoreRowsQuery'
import { createContext } from 'react'

export type GridContextParams = {
  storesById: Record<Store['id'], Store>
  groupsById: Record<Group['id'], Group>
  actionStoresById: Record<ActionStore['id'], ActionStore>
  storeImpact: Record<Store['id'], number | null>
  storeStatues: Record<Store['id'], ActionStoreStatus[]>
  addActionsCountByStoreId: Record<Store['id'], number>
}

export const GridContext = createContext<GridContextParams>({} as GridContextParams)
