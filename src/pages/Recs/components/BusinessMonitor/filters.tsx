import type { ProductTag } from '@/api/types.generated'
import type { FiltersSet } from '@/store/businessFilters'

export enum FilterType {
  ProductFlag = 'PF',
  ProductTag = 'PT',
  SeriesFlag = 'SF'
}

export const unpackId = (v: string) => v.split(':')[1]
export const packId = (type: FilterType, id: string | number) => `${type}:${id}`
export const isType = (type: FilterType) => (v: string) => v.startsWith(type.toString())

export const serializeFilters = (value: FiltersSet, tags: ProductTag[]) => {
  const { productFlags: productFlagsAny, productTagIds, seriesFlags } = value

  return [
    ...productFlagsAny.map((flag) => packId(FilterType.ProductFlag, flag)),
    ...tags.filter((tag) => productTagIds.includes(tag.id)).map((tag) => packId(FilterType.ProductTag, tag.id)),
    ...seriesFlags.map((flag) => packId(FilterType.SeriesFlag, flag))
  ]
}

export const unserializeFilters = (value: string[] | string) => {
  const ids = [value].flat()

  const filterSet: FiltersSet = {
    productFlags: ids.filter(isType(FilterType.ProductFlag)).map(unpackId).map(Number),
    productTagIds: ids.filter(isType(FilterType.ProductTag)).map(unpackId),
    seriesFlags: ids.filter(isType(FilterType.SeriesFlag)).map(unpackId).map(Number)
  }

  return filterSet
}
