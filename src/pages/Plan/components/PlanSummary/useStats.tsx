import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import { useMemo } from 'react'

// TODO: Check if we want to have 0 or null when all action stores are null in predicted sales
export const useStats = (rows: readonly ActionStoreRow[]) => {
  const predictedImpact = useMemo(
    () =>
      rows?.reduce(
        (acc, a) => acc + (a.actionStore.actionType === 'Add' ? 1 : -1) * (a.actionStore.predictedSales ?? 0),
        0
      ),
    [rows]
  )

  const pastSales = useMemo(() => rows?.reduce((acc, a) => acc + a.actionStore.pastSales, 0), [rows])

  return { pastSales, predictedImpact }
}
