import type { AddRecGroup, Group, Store } from '@/api/types.generated'
import type { Filters } from '@/pages/Plan/components/EditSwap/useSearchAddRecommendations'
import { useMemo } from 'react'
import { useRemoveRecs } from '@/hooks/useRemoveRecs'

export const useRemoveRecommendations = ({
  filters,
  ids,
  searchGroupIds
}: {
  filters: Filters
  ids: Store['id'][]
  searchGroupIds: Group['id'][] | undefined
}) => {
  const { data: removeRecs, isFetching } = useRemoveRecs({
    storeIds: ids,
    categoryId: filters.categoryId!,
    subcategoryIds: filters.subcategoryIds,
    groupIds: searchGroupIds,
    enabled: Boolean(filters.categoryId) && filters.subcategoryIds.length > 0 && Boolean(ids)
  })

  const rows = useMemo(() => {
    return removeRecs.map(({ recGroup, group }) => {
      const addRecGroup: AddRecGroup = {
        groupId: recGroup.groupId,
        pastSalesSumOverFilteredStores: recGroup.pastSales,
        pastSalesSumOverFilteredAddableStores: recGroup.pastSales,
        predictedSalesSumOverAllStores: recGroup.predictedSales,
        predictedSalesSumOverFilteredStores: recGroup.predictedSales,
        predictedSalesSumOverFilteredAddableStores: recGroup.predictedSales,
        subcategoryIds: recGroup.subcategoryIds,
        pastSalesSumOverAllStores: -1,
        storeCountOverAlreadyOnFloor: -1,
        storeCountOverAdditionPending: 0,
        storeCountOverRemovalPending: -1,
        productFlagsAny: recGroup.productFlagsAny,
        productFlagsAll: 0,
        productTagsAny: recGroup.productTagsAny,
        productTagsAll: recGroup.productTagsAll,
        filteredAddableStores: []
      }

      return { addRecGroup, group }
    })
  }, [removeRecs])

  return { rows, isFetching }
}
