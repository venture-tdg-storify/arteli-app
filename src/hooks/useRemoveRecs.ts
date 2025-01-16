import type { Category, Group, RecGroup, Store, Subcategory } from '@/api/arteli'
import { useMemo } from 'react'
import { groupById } from '@arteli/utils'
import dayjs from 'dayjs'
import { useTenantSettings } from '@/hooks/useTenantSettings'
import { useVisibleTags } from '@/hooks/useVisibleTags'
import { businessFilters } from '@/store/businessFilters'
import { _5_MINUTES, ProductFlagsToBitMask, ProductTagsByIds, ProductTagsToBitMask, unique } from '@/utils'
import { SeriesFlags } from '@/utils/seriesFlags'
import { useGroupsByIdsQuery, useRecGroupQuery } from './arteli'

export type RemoveRec = {
  recGroup: RecGroup
  group: Group
}

const noRemoveRecs: RemoveRec[] = []
const noRecGroups: RecGroup[] = []
const noGroups: Group[] = []

export const useRemoveRecs = ({
  categoryId,
  subcategoryIds,
  storeIds,
  groupIds,
  includeRecentlyAddedGroups,
  enabled
}: {
  categoryId: Category['id']
  subcategoryIds: Subcategory['id'][]
  storeIds: Store['id'][]
  groupIds?: Group['id'][]
  enabled?: boolean
  includeRecentlyAddedGroups?: boolean
}) => {
  const { removeShow, removeHide } = businessFilters.use()
  const { removeFlags: removeTags } = useVisibleTags()

  const { data: tenantSettings, isFetching: isFetchingTenantSettings } = useTenantSettings()

  const { data: recGroups = noRecGroups, isFetching: isFetchingRemoveRecs } = useRecGroupQuery({
    params: {
      storeIds,
      subcategoryIds,
      categoryId: categoryId!,
      groupIds,
      actionType: 'Remove',
      includeRecentlyAddedGroups
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: _5_MINUTES
  })

  const groupRefs = useMemo(() => unique(recGroups.map((rec) => rec.groupId)), [recGroups])

  const { data: groups = noGroups, isFetching: isFetchingGroups } = useGroupsByIdsQuery({
    params: { ids: groupRefs },
    enabled
  })

  const isFetching = isFetchingRemoveRecs || isFetchingTenantSettings || isFetchingGroups

  const data = useMemo<RemoveRec[]>(() => {
    if (isFetching || !tenantSettings) return noRemoveRecs

    const groupsById = groupById(groups)

    const showProductFlagsMask = ProductFlagsToBitMask(removeShow.productFlags)
    const showProductTagsMask = ProductTagsToBitMask(ProductTagsByIds(removeTags, removeShow.productTagIds))
    const hideProductFlagsMask = ProductFlagsToBitMask(removeHide.productFlags)
    const onlyInactive = removeShow.seriesFlags.includes(SeriesFlags.Inactive)
    const hideProductTagsMask = ProductTagsToBitMask(ProductTagsByIds(removeTags, removeHide.productTagIds))
    const excludeRecentlyAdded = removeHide.seriesFlags.includes(SeriesFlags.RecentlyAdded)
    const trasholdData = dayjs().subtract(tenantSettings.recentlyAddedThresholdDays, 'days')

    return recGroups
      .filter(({ productFlagsAny, productTagsAll, lastAddedDate, groupActiveState }) => {
        const shouldHide = productFlagsAny & hideProductFlagsMask || productTagsAll & hideProductTagsMask

        if (shouldHide) return false

        if (excludeRecentlyAdded && lastAddedDate && dayjs(lastAddedDate).isAfter(trasholdData)) {
          return false
        }

        const nowShowFilters = !(onlyInactive || showProductFlagsMask || showProductTagsMask)

        if (nowShowFilters) return true

        return (
          (onlyInactive && groupActiveState === 'Inactive') ||
          productFlagsAny & showProductFlagsMask ||
          productTagsAll & showProductTagsMask
        )
      })
      .map((recGroup) => ({ recGroup, group: groupsById[recGroup.groupId] }))
  }, [
    groups,
    isFetching,
    recGroups,
    removeHide.productFlags,
    removeHide.productTagIds,
    removeHide.seriesFlags,
    removeShow.productFlags,
    removeShow.productTagIds,
    removeShow.seriesFlags,
    removeTags,
    tenantSettings
  ])

  return { data, isFetching }
}
