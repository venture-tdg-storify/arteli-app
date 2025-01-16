import type { CategoryPerf } from '@/api/types.generated'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'

export type ActionStoreStatus = 'Now on floor' | 'No longer on floor' | 'Inactive Series'

const initialData: CategoryPerf[] = [] as CategoryPerf[]

const apiHandler = api.Arteli.Perf.byCategory

export const usePerfReport = ({
  params,
  enabled,
  refetchOnMount,
  refetchOnWindowFocus,
  staleTime,
  gcTime
}: Parameters<typeof apiHandler>[0] & {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  meta?: unknown
  staleTime?: number
  refetchOnMount?: boolean
  gcTime?: number
} = {}) => {
  return useQuery({
    initialData,
    queryKey: ['perf-rows', ...apiHandler.getQueryKey(params)],
    refetchOnWindowFocus,
    refetchOnMount,
    staleTime,
    gcTime,
    queryFn: async ({ signal }) => {
      const categoryPerfs = await apiHandler({ signal, params })

      if (categoryPerfs.length === 0) {
        return initialData
      }

      return categoryPerfs
    },
    enabled
  })
}
