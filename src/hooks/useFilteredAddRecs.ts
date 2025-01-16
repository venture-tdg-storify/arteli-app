import type { AddRecGroup, Category, Group, Store, Subcategory } from '@/api/arteli'
import { useMemo } from 'react'
import { useVisibleTags } from '@/hooks/useVisibleTags'
import { businessFilters } from '@/store/businessFilters'
import { ProductFlagsToBitMask, ProductTagsByIds, ProductTagsToBitMask } from '@/utils'
import { SeriesFlags } from '@/utils/seriesFlags'
import { useAddRecs } from './useAddRecs'

export type AddRec = {
  addRecGroup: AddRecGroup
  group: Group
}

export const useFilteredAddRecs = ({
  params: { categoryId, subcategoryIds, storeIds, groupIds },
  enabled
}: {
  params: {
    categoryId: Category['id']
    subcategoryIds: Subcategory['id'][]
    storeIds: Store['id'][]
    groupIds?: Group['id'][]
  }
  enabled?: boolean
}) => {
  const { addHide, addShow } = businessFilters.use()
  const { addFlags: addTags, removeFlags: removeTags } = useVisibleTags()

  const excludeNegative = addHide.seriesFlags.includes(SeriesFlags.NegativeMargin)
  const excludeRecentlyRemoved = addHide.seriesFlags.includes(SeriesFlags.RecentlyRemoved)

  const { data: addRecGroups, isFetching } = useAddRecs({
    params: {
      storeIds,
      categoryId,
      subcategoryIds,
      groupIds,
      excludeRecentlyRemoved,
      excludeNegative
    },
    enabled
  })

  const data = useMemo(() => {
    const showProductFlagsMask = ProductFlagsToBitMask(addShow.productFlags)
    const showProductTagsMask = ProductTagsToBitMask(ProductTagsByIds(addTags, addShow.productTagIds))
    const hideProductFlagsMask = ProductFlagsToBitMask(addHide.productFlags)
    const hideProductTagsMask = ProductTagsToBitMask(ProductTagsByIds(removeTags, addHide.productTagIds))

    return addRecGroups.filter(({ addRecGroup: { productTagsAll, productFlagsAny } }) => {
      const shouldHide = productFlagsAny & hideProductFlagsMask || productTagsAll & hideProductTagsMask

      if (shouldHide) return false

      const noShowFilters = !(showProductFlagsMask || showProductTagsMask)

      if (noShowFilters) return true

      return productFlagsAny & showProductFlagsMask || productTagsAll & showProductTagsMask
    })
  }, [
    addRecGroups,
    addShow.productFlags,
    addShow.productTagIds,
    addTags,
    addHide.productFlags,
    addHide.productTagIds,
    removeTags
  ])

  return { data, isFetching }
}
