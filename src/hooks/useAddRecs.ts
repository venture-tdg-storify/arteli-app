import type { AddRecGroup, Group } from '@/api/arteli'
import { groupById } from '@arteli/utils'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'
import { unique } from '@/utils'
import { fetchAllGroupsByIds } from './arteli'

export type AddRec = {
  addRecGroup: AddRecGroup
  group: Group
}

const initialData: AddRec[] = []

type Params = NonNullable<Parameters<typeof api.Arteli.Recs.getAddRecGroups>['0']>['params']

const getAddRecGroups = api.Arteli.Recs.getAddRecGroups

export const useAddRecs = ({ params, enabled }: { params: Params; enabled?: boolean }) => {
  return useQuery({
    initialData,
    enabled,
    refetchOnWindowFocus: false,
    queryKey: ['rows', ...(enabled ? getAddRecGroups.getQueryKey(params) : [])],
    queryFn: async () => {
      const addRecGroups = await getAddRecGroups({ params })

      const groupIds = unique(addRecGroups.map(({ groupId }) => groupId))

      const groups = await fetchAllGroupsByIds({ params: { ids: groupIds } })

      const groupsById = groupById(groups)

      return addRecGroups.map((addRecGroup) => ({ addRecGroup, group: groupsById[addRecGroup.groupId] }))
    }
  })
}
