import type { Group, Store } from '@/api/arteli'
import { createContext } from 'react'

export type GridContextParams = {
  storesById: Record<Store['id'], Store>
  groupsById: Record<Group['id'], Group>
  clearanceStatus: Record<Store['id'], boolean>
  swapImpact: Record<Store['id'], number | undefined>
}

export const GridContext = createContext<GridContextParams>({} as GridContextParams)
