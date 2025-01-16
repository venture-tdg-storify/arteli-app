import type { Group } from '@/api/types.generated'
import { useMemo } from 'react'
import api from '@/api'
import { useProductsByIdsQuery } from '@/hooks/arteli'
import { useAddRecProductsBySubgroupIds } from '@/hooks/useAddRecProductIds'
import { useFilterFlags, useFilters } from '@/hooks/useFilters'

const useAddRecsSubgroups = api.Arteli.Recs.getAddRecSubgroups.asQuery()

export const useRecommendationDetails = ({ groupId, open }: { groupId: Group['id']; open: boolean }) => {
  const { categoryId, storeIds, subcategoryIds } = useFilters()
  const { filtersValid } = useFilterFlags()
  const params = { storeIds, categoryId: categoryId!, subcategoryIds }

  const { data: addRecSubgroups, isFetching: isFetchingAddRecSubgroups } = useAddRecsSubgroups({
    params: { ...params, groupId },
    enabled: filtersValid && open
  })

  const { data: addRecProducts, isFetching: isFetchingAddRecProductIds } = useAddRecProductsBySubgroupIds({
    ...params,
    groupId,
    subgroupIds: (addRecSubgroups ?? []).map(({ subgroupId }) => subgroupId)
  })

  const productIds = useMemo(() => [...new Set(addRecProducts.map((_) => _.productId))], [addRecProducts])

  const { data: products, isFetching: isFetchingProduct } = useProductsByIdsQuery({
    params: { ids: productIds, includeInactive: true },
    enabled: Boolean(productIds.length)
  })

  const imageUrls = useMemo(() => products?.find((_) => _.imageUrls?.length)?.imageUrls ?? [], [products])

  return {
    imageUrls,
    isFetching: isFetchingAddRecSubgroups || isFetchingAddRecProductIds || isFetchingProduct,
    products,
    addRecProducts,
    addRecSubgroups
  }
}
