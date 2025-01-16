import type { Group } from '@/api/types.generated'
import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import api from '@/api'
import { useGroupQuery, useProductsByIdsQuery } from '@/hooks/arteli'
import { useFilterFlags, useFilters } from '@/hooks/useFilters'
import { unique } from '@/utils'

const useAddRecSubgroups = api.Arteli.Recs.getAddRecSubgroups.asQuery()
const useAddRecsGroups = api.Arteli.Recs.getAddRecGroups.asQuery()

export const useRecommendationDetails = ({ groupId }: { groupId: Group['id'] }) => {
  const { categoryId, storeIds, subcategoryIds } = useFilters()
  const { filtersValid } = useFilterFlags()
  const params = { storeIds, categoryId: categoryId!, subcategoryIds }

  const { data: group, isFetching: isFetchingGroup } = useGroupQuery({ params: { id: groupId } })

  const { data: addRecGroups, isFetching: isFetchingAddRecGroups } = useAddRecsGroups({
    params: { ...params, groupIds: [groupId] },
    enabled: filtersValid,
    staleTime: Infinity
  })

  const { data: addRecSubgroups, isFetching: isFetchingAddRecSubgroups } = useAddRecSubgroups({
    params: { ...params, groupId },
    enabled: filtersValid,
    staleTime: Infinity
  })

  const addRecProductsResults = useQueries({
    queries: (addRecSubgroups ?? []).map((_) =>
      api.Arteli.Recs.getAddRecProducts.asQueryParams({
        params: { ...params, groupId, subgroupId: _.subgroupId },
        staleTime: Infinity
      })
    )
  })

  const addRecProducts = useMemo(() => addRecProductsResults.flatMap((_) => _.data ?? []), [addRecProductsResults])
  const isFetchingAddRecProducts = addRecProductsResults.some((_) => _.isFetching)

  const productIds = useMemo(() => unique(addRecProducts.map((_) => _.productId)), [addRecProducts])

  const { data: products, isFetching: isFetchingProduct } = useProductsByIdsQuery({
    params: { ids: productIds, includeInactive: true },
    enabled: Boolean(productIds.length)
  })

  const imageUrls = useMemo(() => products?.find((_) => _.imageUrls?.length)?.imageUrls ?? [], [products])

  return {
    productIds,
    imageUrls,
    group,
    addRecGroup: addRecGroups?.[0],
    addRecSubgroups,
    addRecProducts,
    products,
    isFetching:
      isFetchingGroup ||
      isFetchingAddRecGroups ||
      isFetchingAddRecSubgroups ||
      isFetchingAddRecProducts ||
      isFetchingProduct
  }
}
