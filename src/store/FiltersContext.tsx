import type { Category, Store, Subcategory } from '@/api/arteli'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { getLocalValue, setLocalValue } from '@arteli/utils'
import { useSearchParams } from 'react-router-dom'
import { useAllRelevantCategories, useAllRelevantSubcategories, useAllStores } from '@/hooks/arteli'
import { FiltersContext } from '@/hooks/useFilters'
import { isEqual } from '@/utils'
import analytics from '@/utils/analytics'

export type FilterParams = {
  categoryId: Category['id'] | null
  subcategoryIds: Subcategory['id'][]
  storeIds: Store['id'][]
}

export type FiltersContextParams = FilterParams & {
  setParams: (params: Partial<FilterParams>) => void
}

type FilterKey = keyof FilterParams
type FilterValue = FilterParams[FilterKey]

const isValidSearchParam = (value: unknown) =>
  value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)

export const FILTERS_KEY = 'arteli.filters'

const isValid = (value: FilterValue | null, allowedValues: FilterValue[]) => {
  if (value === null || value === undefined) return false

  const values = [value].flat()

  if (values.length === 0) return false

  return values.every((_) => allowedValues.includes(_))
}

const VERSION = 2

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const { data: categories, isFetching: isFetchingCategories } = useAllRelevantCategories()
  const { data: subcategories, isFetching: isFetchingSubcategories } = useAllRelevantSubcategories()
  const { data: stores, isFetching: isFetchingStores } = useAllStores()

  const storedFilters = getLocalValue<FilterParams | null>(FILTERS_KEY, VERSION, null)
  const [searchParams, setSearchParams] = useSearchParams()
  const storeIdsRef = useRef<Store['id'][]>([])
  const subcategoryIdsRef = useRef<Subcategory['id'][]>([])
  const categoryIdRef = useRef<Category['id'] | null>(null)

  const isFetching = isFetchingCategories || isFetchingSubcategories || isFetchingStores

  const get = useCallback(
    <T extends FilterValue>(
      paramName: FilterKey,
      {
        isArray = false,
        useDefault = true,
        isRequired = false,
        allowedValues
      }: { isArray?: boolean; useDefault?: boolean; isRequired?: boolean; allowedValues: FilterValue[] }
    ) => {
      const urlValue = isArray ? searchParams.getAll(paramName) : searchParams.get(paramName)

      if (isValid(urlValue, allowedValues)) {
        return urlValue as T
      }

      const localValue = storedFilters?.[paramName] ?? null

      if (isValid(localValue, allowedValues)) {
        return localValue as T
      }

      if (useDefault && allowedValues.length > 0) {
        return isArray ? [allowedValues[0]] : allowedValues[0]
      }

      if (isRequired) {
        throw new Error(`Missing required filter param: ${paramName}`)
      }

      return (isArray ? [] : undefined) as unknown as T
    },
    [searchParams, storedFilters]
  )

  const { storeIds, categoryId, subcategoryIds } = useMemo<FilterParams>(() => {
    if (isFetching)
      return {
        storeIds: storeIdsRef.current,
        categoryId: categoryIdRef.current,
        subcategoryIds: subcategoryIdsRef.current
      }

    const categoryIds = categories?.map((_) => _.id) || []

    const categoryId = get('categoryId', { isRequired: false, useDefault: false, allowedValues: categoryIds })

    const subcategoryIds = categoryId
      ? get('subcategoryIds', {
          isArray: true,
          allowedValues: (subcategories ?? [])
            .filter((_) => _.categoryIds.includes(categoryId as string))
            .map((_) => _.id)
        })
      : []

    const storeIds = get('storeIds', { isArray: true, isRequired: true, allowedValues: stores?.map((_) => _.id) || [] })

    return { storeIds, categoryId, subcategoryIds } as FilterParams
  }, [categories, get, stores, subcategories, isFetching])

  const setParams = useCallback(
    // TODO: Check if values are within the allowed values
    (params: Partial<FilterParams>) => {
      const searchParams = Object.fromEntries(
        Object.entries({
          categoryId: categoryIdRef.current,
          subcategoryIds: subcategoryIdsRef.current,
          storeIds: storeIdsRef.current,
          ...params
        }).filter(([, value]) => isValidSearchParam(value))
      ) as unknown as URLSearchParams

      setLocalValue(FILTERS_KEY, VERSION, searchParams)

      setSearchParams(searchParams, { replace: true })
      analytics?.track('Filters Changed', searchParams)
    },
    [setSearchParams]
  )

  const value = useMemo(() => {
    if (!isFetchingCategories && !isEqual(categoryId, categoryIdRef.current)) {
      // console.log('Category id changed', categoryId)
      categoryIdRef.current = categoryId
    }

    if (!isFetchingSubcategories && !isEqual(subcategoryIds, subcategoryIdsRef.current)) {
      // console.log('Subcategory ids changed', subcategoryIds)
      subcategoryIdsRef.current = subcategoryIds
    }

    if (!isFetchingStores && !isEqual(storeIds, storeIdsRef.current)) {
      // console.log('Store ids changed', storeIds)
      storeIdsRef.current = storeIds
    }

    return {
      categoryId: categoryIdRef.current,
      subcategoryIds: subcategoryIdsRef.current,
      storeIds: storeIdsRef.current,
      setParams
    }
  }, [categoryId, subcategoryIds, storeIds, setParams, isFetchingCategories, isFetchingSubcategories, isFetchingStores])

  if (storeIds.length <= 0) return null

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}
