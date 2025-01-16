import type { ActionCompletionStatus, ActionStore, Category, Group, Store } from '@/api/arteli'
import { createContext } from 'react'

export type GridContextParams = {
  storesById: Record<Store['id'], Store>
  actionStoresById: Record<ActionStore['id'], ActionStore>
  groupsById: Record<Group['id'], Group>
  predictedSalesByStoreId: Record<Store['id'], number | null>
  addActionsCountByStoreId: Record<Store['id'], number>
  swapStatusesByStoreId: Record<Store['id'], ActionCompletionStatus[]>

  categoryExternalIds: Category['externalId'][]
  setCategoryExternalIds: (categoryExternalIds: Category['externalId'][]) => void
  selectedCategoryExternalIds: Category['externalId'][]
  setSelectedCategoryExternalIds: (categoryExternalIds: Category['externalId'][]) => void

  actionCompletionStatuses: ActionCompletionStatus[]
  setActionCompletionStatuses: (statuses: ActionCompletionStatus[]) => void
  selectedActionCompletionStatuses: ActionCompletionStatus[]
  setSelectedActionCompletionStatuses: (statuses: ActionCompletionStatus[]) => void
}

export const GridContext = createContext<GridContextParams>({} as GridContextParams)
