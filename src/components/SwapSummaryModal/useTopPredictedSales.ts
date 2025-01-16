import { useMemo } from 'react'
import api from '@/api'
import { useAllRejections } from '@/hooks/arteli'
import { useFilterFlags, useFilters } from '@/hooks/useFilters'

const useAddRecGroupsQuery = api.Arteli.Recs.getAddRecGroups.asQuery()

export const useTopPredictedSales = () => {
  const { categoryId, subcategoryIds, storeIds: stores } = useFilters()
  const { allSubcategoriesSelected, filtersValid } = useFilterFlags()
  const subcategoryId = allSubcategoriesSelected ? undefined : subcategoryIds[0]

  const { data: rejections = [], isFetching: isFetchingRejections } = useAllRejections({
    params: { onlyActive: true, storeIds: stores, categoryId: categoryId!, subcategoryId },
    enabled: filtersValid
  })

  const { data: addRecGroups = [], isFetching: isFetchingAddRecs } = useAddRecGroupsQuery({
    params: { storeIds: stores, categoryId: categoryId!, subcategoryIds },
    enabled: filtersValid
  })

  const rejectedGroupIds = rejections.map((rejection) => rejection.groupId)

  const topPredictedSales = useMemo(() => {
    return addRecGroups.filter((rec) => !rejectedGroupIds.includes(rec.groupId))[0]
      ?.predictedSalesSumOverFilteredAddableStores
  }, [addRecGroups, rejectedGroupIds])

  return { topPredictedSales, isFetching: isFetchingAddRecs || isFetchingRejections }
}
