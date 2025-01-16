import type { Row } from './useRows'
import type { Group, Store } from '@/api/arteli'
import { useContext, createContext } from 'react'

interface ISwapContext {
  isFetching: boolean
  includeRecentlyAddedGroups?: boolean
  group?: Group
  items: Row[]
  replaceItem: (id: Store['id'], newItem: Row) => void
  deleteStore: (id: Store['id']) => void
  deleteSeries: (storeId: Store['id'], groupId: Group['id']) => void
  setNote: (id: Group['id'], note: string) => void
}

export const SwapContext = createContext<ISwapContext>({} as ISwapContext)

export const useSwap = () => useContext(SwapContext)
