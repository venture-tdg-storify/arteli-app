import type { FilterParams } from '@/store/FiltersContext'
import { useEffect, useMemo, useState } from 'react'
import { groupByProperty } from '@arteli/utils'
import { RecGroupRecStoreFlags, type Group, type RecGroup, type Store } from '@/api/arteli'
import { useRecGroupQuery, useStoresByIdsQuery } from '@/hooks/arteli'
import { useFilterFlags, useFilters } from '@/hooks/useFilters'
import { useRemoveRecs } from '@/hooks/useRemoveRecs'

export type Row = {
  recGroup?: RecGroup
  group?: Group
  filters?: { categoryId: FilterParams['categoryId']; subcategoryId: string | null }
  store: Store
  note: string
  addRecGroupPredictedSales?: number
  clearance: boolean
}

const initialData: Row[] = [] as Row[]

export const getSwapImpact = ({ addRecGroupPredictedSales, recGroup }: Row) =>
  (addRecGroupPredictedSales ?? 0) - (recGroup?.predictedSales ?? 0)

export const useRows = ({
  groupId,
  storeIds,
  includeRecentlyAddedGroups
}: {
  groupId?: Group['id']
  storeIds: Store['id'][]
  includeRecentlyAddedGroups?: boolean
}) => {
  const { categoryId, subcategoryIds } = useFilters()
  const { allSubcategoriesSelected } = useFilterFlags()

  const filters = useMemo(
    () => ({ categoryId: categoryId!, subcategoryId: allSubcategoriesSelected ? null : subcategoryIds[0] }),
    [allSubcategoriesSelected, categoryId, subcategoryIds]
  )

  const { data: addRecGroups, isFetching: isFetchingAddRecProducts } = useRecGroupQuery({
    params: {
      storeIds,
      subcategoryIds,
      categoryId: categoryId!,
      actionType: 'Add',
      groupIds: [groupId!],
      includeRecentlyAddedGroups
    },
    refetchOnWindowFocus: false
  })

  const { data: stores, isFetching: isFetchingStores } = useStoresByIdsQuery({ params: { ids: storeIds } })

  const { data: removeRecs, isFetching: isFetchingRemoveRecs } = useRemoveRecs({
    categoryId: categoryId!,
    storeIds,
    subcategoryIds,
    includeRecentlyAddedGroups
  })

  const [rows, setRows] = useState<Row[]>(initialData)

  const isFetching = isFetchingRemoveRecs || isFetchingAddRecProducts || isFetchingStores

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      if (!stores?.length || !addRecGroups?.length) {
        return initialData
      }

      const addRecGroupByStoreId = groupByProperty(addRecGroups, 'storeId')

      return stores
        .filter((_) => Boolean(addRecGroupByStoreId[_.id]))
        .map((store) => {
          const removeRec = removeRecs.find((_) => _.recGroup.storeId === store.id)
          const addRecGroup = addRecGroupByStoreId[store.id]

          return {
            store,
            ...(removeRec && { ...removeRec, filters }),
            note: '',
            addRecGroupPredictedSales: addRecGroup.predictedSales,
            clearance:
              addRecGroup.actionType === 'Add' &&
              Boolean(addRecGroup.recStoreFlagsAny & RecGroupRecStoreFlags.Clearance)
          }
        })
    })
  }, [addRecGroups, filters, isFetching, removeRecs, stores])

  return { rows, isFetching }
}
