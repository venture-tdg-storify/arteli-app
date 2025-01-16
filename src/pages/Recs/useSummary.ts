import { useMemo } from 'react'
import api from '@/api'
import { useAllActionStoresQuery } from '@/hooks/arteli'

const useActionSetQuery = api.Arteli.ActionSets.findOne.asQuery()

// TODO: Check if we want to have 0 or null when all action stores are null in predicted sales
// TODO: This looks the same as useStats, maybe we can merge them

export const useSummary = (id: string | undefined = 'active') => {
  const { data: actionSet, isFetching: isFetchingActionSet } = useActionSetQuery({ params: { id } })

  const { data: actionStores, isFetching: isFetchingActionStores } = useAllActionStoresQuery({
    params: { setIds: actionSet ? [actionSet.id] : [] },
    enabled: Boolean(actionSet?.id)
  })

  const summary = useMemo(
    () => ({
      total: actionStores?.length || 0,
      count: actionStores?.filter((a) => a.actionType === 'Add').length || 0,
      predictedImpact:
        actionStores?.reduce((acc, a) => acc + (a.actionType === 'Add' ? 1 : -1) * (a.predictedSales ?? 0), 0) || 0,
      updatedAt: actionSet?.updatedAt
    }),
    [actionSet, actionStores]
  )

  const isFetching = isFetchingActionSet || isFetchingActionStores

  return { summary, isFetching }
}
