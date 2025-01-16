import type { ActionStorePerf } from '@/api/types.generated'
import { useEffect, useState } from 'react'
import { dateRange } from './dateRange'
import { ALL_CATEGORIES_ID, type Filters } from './useFilters'
import { usePerfReport } from './usePerfReport'

export const useRows = ({ filters }: { filters: Filters }) => {
  const { from, to } = dateRange.use()

  const {
    isFetching,
    isRefetching,
    refetch,
    data: categoryPerfs
  } = usePerfReport({
    params: {
      fromDate: from.format('YYYY-MM-DD'),
      toDate: to.format('YYYY-MM-DD'),
      categoryId: filters.categoryId === ALL_CATEGORIES_ID ? undefined : filters.categoryId,
      storeIds: filters.storeIds
    },
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity
  })

  const [rows, setRows] = useState<ActionStorePerf[]>([])

  useEffect(() => {
    if (isFetching || isRefetching || !categoryPerfs) {
      return
    }

    setRows(
      categoryPerfs.map((perf, index) => ({
        id: index,
        ...perf
      }))
    )
  }, [categoryPerfs, isFetching, isRefetching])

  return { rows, isFetching: isFetching || isRefetching, refetch }
}
