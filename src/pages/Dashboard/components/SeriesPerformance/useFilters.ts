import type { Category, Store, Subcategory } from '@/api/types.generated'
import { useCallback, useEffect, useState } from 'react'
import { useAllStores } from '@/hooks/arteli'
import { isEqual } from '@/utils'

export type Filters = {
  storeIds: Store['id'][]
  categoryId: Category['id'] | string
  subcategoryIds: Subcategory['id'][]
  changeStore: (storeIds: Store['id'][]) => void
  changeCategory: (filters: { categoryId: Category['id'] | null; subcategoryIds: Subcategory['id'][] }) => void
}

export const ALL_CATEGORIES_ID: Category['id'] = '__all_categories__'
export const ALL_SUBCATEGORIES_ID: Subcategory['id'] = '__all_subcategories__'

export const useFilters = (allowEmpty = false) => {
  const { data: stores } = useAllStores()

  const [categoryId, setCategoryId] = useState<Category['id']>(allowEmpty ? '' : ALL_CATEGORIES_ID)
  const [subcategoryIds, setSubcategoryIds] = useState<Subcategory['id'][]>(allowEmpty ? [] : [ALL_SUBCATEGORIES_ID])
  const [storeIds, setStoreIds] = useState<Store['id'][]>([])

  useEffect(() => {
    if (stores && !allowEmpty) {
      setStoreIds(stores.map((_) => _.id))
    }
  }, [allowEmpty, stores])

  const changeCategory = useCallback(
    ({ categoryId, subcategoryIds }: { categoryId: Category['id'] | null; subcategoryIds: Subcategory['id'][] }) => {
      setCategoryId(categoryId!)
      setSubcategoryIds((oldSubcategoryIds) =>
        isEqual(oldSubcategoryIds, subcategoryIds) ? oldSubcategoryIds : subcategoryIds
      )
    },
    []
  )

  const changeStore = useCallback((storeIds: Store['id'][]) => {
    setStoreIds((oldStoreIds) => (isEqual(oldStoreIds, storeIds) ? oldStoreIds : storeIds))
  }, [])

  return { storeIds, categoryId, subcategoryIds, changeStore, changeCategory }
}
