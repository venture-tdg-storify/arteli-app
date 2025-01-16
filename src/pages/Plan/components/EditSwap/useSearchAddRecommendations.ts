import type { AddRecGroup, Group, RecNote, Rejection, Store } from '@/api/types.generated'
import type { FilterParams } from '@/store/FiltersContext'
import { useEffect, useState } from 'react'
import { useAddRecs } from '@/hooks/useAddRecs'
import { useFilteredAddRecs } from '@/hooks/useFilteredAddRecs'

export type Filters = Omit<FilterParams, 'storeIds'>

export type AddRecGroupRow = {
  addRecGroup: AddRecGroup
  group: Group
  rejection?: Rejection
  notes?: RecNote
}

const initialData: AddRecGroupRow[] = [] as AddRecGroupRow[]

export const useSearchAddRecommendations = ({
  filters,
  ids,
  searchGroupIds,
  filterValues = false
}: {
  filters: Filters
  ids: Store['id'][]
  searchGroupIds: Group['id'][] | undefined
  filterValues?: boolean
}) => {
  const paramsValid = Boolean(filters.categoryId) && filters.subcategoryIds.length > 0 && ids.length > 0

  const { data: addRecGroups, isFetching } = (filterValues ? useFilteredAddRecs : useAddRecs)({
    params: {
      storeIds: ids,
      categoryId: filters.categoryId!,
      subcategoryIds: filters.subcategoryIds,
      groupIds: searchGroupIds
    },
    enabled: paramsValid
  })

  const [rows, setRows] = useState<AddRecGroupRow[]>(initialData)

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      if (!addRecGroups?.length) {
        return initialData
      }

      return addRecGroups
    })
  }, [addRecGroups, isFetching])

  return { rows, isFetching }
}
