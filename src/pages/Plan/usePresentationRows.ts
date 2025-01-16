import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import { useMemo } from 'react'
import { usePresentation } from '@/components/PresentationMenu/usePresentation'

export const usePresentationRows = (rows_: readonly ActionStoreRow[]) => {
  const { items } = usePresentation()

  const rows = useMemo(() => {
    if (items.length > 0) {
      return rows_.map((row) => {
        const item = items.find(({ id }) => id === row.actionStore.id)
        return item ? { ...row, status: item.status } : row
      })
    }
    return rows_
  }, [items, rows_])

  return { rows }
}
