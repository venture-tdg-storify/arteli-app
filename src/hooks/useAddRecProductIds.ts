import type { AddRecProduct, Category, Group, Store, Subcategory, Subgroup } from '@/api/types.generated'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'

const initialData: AddRecProduct[] = []

export const useAddRecProductsBySubgroupIds = ({
  subgroupIds = [],
  storeIds,
  categoryId,
  subcategoryIds,
  groupId
}: {
  subgroupIds: Subgroup['id'][]
  storeIds: Store['id'][]
  categoryId: Category['id']
  subcategoryIds: Subcategory['id'][]
  groupId: Group['id']
}) => {
  const params = {
    storeIds,
    categoryId,
    subcategoryIds,
    groupId,
    subgroupId: subgroupIds.length ? subgroupIds[0] : ''
  }

  return useQuery({
    initialData,
    queryKey: ['by-subgroup-ids', ...api.Arteli.Recs.getAddRecProducts.getQueryKey(params)],
    queryFn: async ({ signal }) => {
      const data = await Promise.all(
        subgroupIds.map((subgroupId) =>
          api.Arteli.Recs.getAddRecProducts({ params: { ...params, subgroupId }, signal })
        )
      )
      return data.flat()
    },
    enabled: Boolean(subgroupIds.length)
  })
}
