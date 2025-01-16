import type { ActionCompletionStatus, ActionStore } from '@/api/types.generated'
import type { ActionStoreStatus } from '@/hooks/useActionStoreRowsQuery'
import { useContext, createContext } from 'react'

export interface IPresentationItem {
  id: ActionStore['id']
  status?: ActionStoreStatus
  completionStatus: ActionCompletionStatus
  completionDate: string | null
  overdueDate: string | null
}

interface IPresentationContext {
  items: IPresentationItem[]
  setItem: (item: IPresentationItem) => void
  resetItem: (id: IPresentationItem['id']) => void
  resetAll: () => void
  isPresentation: boolean
}

export const PresentationContext = createContext<IPresentationContext>({} as IPresentationContext)

export const usePresentation = () => useContext(PresentationContext)
