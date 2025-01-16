import api from '@/api'
import { useActionStoreRowsQuery } from '@/hooks/useActionStoreRowsQuery'

const useActionSetQuery = api.Arteli.ActionSets.findOne.asQuery()

export const useActiveActionSet = ({ id }: { id: string | null }) => {
  const { data: actionSet, isFetching: isFetchingActionSet } = useActionSetQuery({
    params: { id: id ?? 'active' },
    enabled: Boolean(id)
  })

  const { data: rows, isFetching: isFetchingRows } = useActionStoreRowsQuery({
    params: { setIds: actionSet?.id ? [actionSet?.id] : [] },
    enabled: Boolean(actionSet?.id)
  })

  const isFetching = isFetchingActionSet || isFetchingRows

  return { rows, actionSet, isFetching }
}
