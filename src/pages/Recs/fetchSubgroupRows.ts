import type { Group, AddRecSubgroup, Subgroup, Category, Store, Subcategory } from '@/api/arteli'
import { groupById } from '@arteli/utils'
import api from '@/api'
import { fetchAllSubgroupsByIds } from '@/hooks/arteli'

export type AddRecSubgroupRow = {
  addRecSubgroup: AddRecSubgroup
  subgroup: Subgroup
}

export const fetchSubgroupRows = async (params: {
  categoryId: Category['id']
  groupId: Group['id']
  storeIds: Store['id'][]
  subcategoryIds: Subcategory['id'][]
  subgroupId?: Subgroup['id']
}) => {
  const addRecSubgroups = await api.Arteli.Recs.getAddRecSubgroups({ params: params! })

  const subgroupIds = addRecSubgroups.map(({ subgroupId }) => subgroupId)

  const subgroups = await fetchAllSubgroupsByIds({ params: { ids: subgroupIds } })

  const subgroupsById = groupById(subgroups)

  return (addRecSubgroups ?? []).map((addRecSubgroup) => ({
    addRecSubgroup,
    subgroup: subgroupsById[addRecSubgroup.subgroupId]
  }))
}
