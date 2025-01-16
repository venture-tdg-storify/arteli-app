import { useQuery } from '@tanstack/react-query'
import api from '@/api'
import { fetchAllFactory } from '@/utils/allItemsQuery'

const initialData = [] as string[]

const fetchAllActionStores = fetchAllFactory({ handler: api.Arteli.ActionStores.findAll })

export const useIds = ({ params }: Parameters<typeof api.Arteli.ActionStores.findAll>[0] = {}) =>
  useQuery({
    initialData,
    queryKey: ['filtered-ids', ...api.Arteli.ActionStores.findAll.getQueryKey(params)],
    queryFn: async ({ signal }) => {
      const actionStores = await fetchAllActionStores({ signal, params })

      return actionStores.map(({ id }) => id)
    },
    enabled: Boolean(params?.setIds?.length)
  })
