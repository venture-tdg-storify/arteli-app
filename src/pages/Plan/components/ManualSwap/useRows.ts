import type { Category, Group, RecGroup, Store, Subcategory } from '@/api/arteli'
import { useEffect, useState } from 'react'
import { groupById } from '@arteli/utils'
import { useGroupsByIdsQuery, useRecGroupQuery } from '@/hooks/arteli'
import { groupByPropertyMulti, unique } from '@/utils'

export type Row = {
  group: Group
  pastSales: number
  predictedSales: number
  productFlagsAny: number
  productTagsAny: number
  storeIds: Store['id'][]
}

const initialData: Row[] = [] as Row[]
const noRecGroups: RecGroup[] = [] as RecGroup[]

export const useRows = ({
  groupIds,
  storeIds,
  categoryId,
  subcategoryIds
}: {
  groupIds: Group['id'][]
  categoryId: Category['id']
  subcategoryIds: Subcategory['id'][]
  storeIds: Store['id'][]
}) => {
  const enabled = !!categoryId && subcategoryIds.length > 0 && groupIds.length > 0 && storeIds.length > 0

  const params = {
    storeIds,
    subcategoryIds,
    categoryId: categoryId ?? '',
    groupIds,
    includeRecentlyAddedGroups: true
  }

  const { data: addRecGroups = noRecGroups, isFetching: isFetchingAddRecProducts } = useRecGroupQuery({
    params: { ...params, actionType: 'Add' },
    refetchOnWindowFocus: false,
    enabled
  })

  const { data: groups, isFetching: isFetchingGroups } = useGroupsByIdsQuery({ params: { ids: groupIds } })

  const [rows, setRows] = useState<Row[]>(initialData)

  const isFetching = isFetchingGroups || isFetchingAddRecProducts

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      if (!addRecGroups?.length || !groups?.length) {
        return initialData
      }

      const addRecGroupsByGroupId = groupByPropertyMulti(addRecGroups, 'groupId')
      const groupsById = groupById(groups)

      return Object.entries(addRecGroupsByGroupId)
        .map(([groupId, recGroups]) => ({
          group: groupsById[groupId],
          pastSales: recGroups.reduce((acc, { pastSales }) => acc + pastSales, 0),
          predictedSales: recGroups.reduce((acc, { predictedSales }) => acc + predictedSales, 0),
          productFlagsAny: recGroups[0].productFlagsAny,
          productTagsAny: recGroups[0].productTagsAny,
          storeIds: unique(recGroups.map(({ storeId }) => storeId))
        }))
        .filter((_) => _.storeIds.length > 0)
    })
  }, [addRecGroups, groups, isFetching])

  return { rows, isFetching }
}
