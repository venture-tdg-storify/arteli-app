import type { FiltersContextParams } from '@/store/FiltersContext'
import { createContext, useContext, useMemo } from 'react'
import { useAllRelevantSubcategories } from './arteli'

export const FiltersContext = createContext<FiltersContextParams>({} as FiltersContextParams)

export const useFilters = () => useContext(FiltersContext)

export const useFilterFlags = () => {
  const { storeIds, categoryId, subcategoryIds } = useFilters()
  const { data: subcategories } = useAllRelevantSubcategories()

  const filtersValid = Boolean(categoryId && storeIds.length > 0)

  const allSubcategoriesSelected = useMemo(() => {
    return (
      categoryId &&
      subcategories
        ?.filter(({ categoryIds }) => categoryIds.includes(categoryId))
        .every(({ id }) => subcategoryIds.includes(id))
    )
  }, [subcategories, categoryId, subcategoryIds])

  const allowActions = filtersValid && (allSubcategoriesSelected || subcategoryIds.length === 1)

  return { filtersValid, allSubcategoriesSelected, allowActions }
}
