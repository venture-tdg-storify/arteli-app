import { useEffect, useState } from 'react'
import { groupById } from '@arteli/utils'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import api from '@/api'
import {
  type Subcategory,
  type Category,
  ProductFlags,
  type ActionType,
  type Group,
  type Product,
  type RecStore,
  type Store,
  type Subgroup,
  RecStoreFlags
} from '@/api/arteli'
import {
  fetchAllCategoriesByIds,
  fetchAllGroupsByIds,
  fetchAllProductsByIds,
  fetchAllSubcategoriesByIds,
  fetchAllSubgroupsByIds
} from '@/hooks/arteli'
import { unique } from '@/utils'
import { fetchAllFactory } from '@/utils/allItemsQuery'

const getDaysOnFloor = (value: RecStore['floorDate']) => {
  const current = dayjs()
  const onFloor = dayjs(value)

  return current.diff(onFloor, 'day')
}

export enum RowType {
  Group = 'group',
  Subgroup = 'subgroup',
  Product = 'product',
  Component = 'component',
  Kit = 'kit'
}

export type Row = {
  id: string
  path: string[]
  type: RowType
  group: Group
  subgroup: Subgroup
  product: Product
  recStore: RecStore
  category: Category
  daysOnFloor: number
  subcategory: Subcategory
}

const initialData: Row[] = [] as Row[]

const Node =
  (type: RowType) =>
  (...path: string[]) => ({
    type,
    path,
    id: path.join('-')
  })

const fetchAllRecStores = fetchAllFactory({ handler: api.Arteli.Recs.getRecStores })

export const useRows = ({ storeIds }: { storeIds: Store['id'][] }) => {
  const params = { storeIds, actionType: 'Remove' as ActionType }

  const { data: { rows: data, groupsById = {}, subgroupsById = {} } = {}, isFetching } = useQuery({
    enabled: storeIds.length > 0,
    queryKey: [api.Arteli.Recs.getRecStores.getQueryKey(params)],
    queryFn: async () => {
      const removeRecStores = await fetchAllRecStores({ params })

      const addRecStores = await fetchAllRecStores({
        params: { storeIds, actionType: 'Add', flags: RecStoreFlags.Clearance }
      })

      const recStores = [...removeRecStores, ...addRecStores]

      const groupIds = unique(recStores.map(({ groupId }) => groupId))
      const subgroupIds = unique(recStores.map(({ subgroupId }) => subgroupId))
      const productIds = unique(recStores.map(({ productId }) => productId))

      const [groups, subgroups, products] = await Promise.all([
        fetchAllGroupsByIds({ params: { ids: groupIds } }),
        fetchAllSubgroupsByIds({ params: { ids: subgroupIds } }),
        fetchAllProductsByIds({ params: { ids: productIds, includeInactive: true } })
      ])

      const categoryIds = unique(products.map(({ categoryId }) => categoryId))
      const subcategoryIds = unique(products.map(({ subcategoryId }) => subcategoryId))

      const [categories, subcategories] = await Promise.all([
        fetchAllCategoriesByIds({ params: { ids: categoryIds } }),
        fetchAllSubcategoriesByIds({ params: { ids: subcategoryIds } })
      ])

      const productsById = groupById(products)
      const groupsById = groupById(groups)
      const subgroupsById = groupById(subgroups)
      const categoriesById = groupById(categories)
      const subcategoriesById = groupById(subcategories)

      const productRows = recStores
        .map((recStore) => {
          const product = productsById[recStore.productId]
          const typePrefix = [product.type].filter((_) => _ !== 'Item')

          return {
            ...Node(RowType.Product)(recStore.groupId, recStore.subgroupId, ...typePrefix, recStore.productId),
            recStore,
            group: groupsById[recStore.groupId],
            subgroup: subgroupsById[recStore.subgroupId],
            daysOnFloor: getDaysOnFloor(recStore.floorDate),
            product,
            category: categoriesById[product.categoryId],
            subcategory: subcategoriesById[product.subcategoryId]
          }
        })
        .sort(({ group: a }, { group: b }) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id))

      return { rows: productRows, groupsById, subgroupsById }
    }
  })

  const [rows, setRows] = useState<Row[]>(initialData)

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      const partialRows = data?.flat()

      if (!partialRows?.length) {
        return initialData
      }

      return partialRows.sort(
        ({ product: a }, { product: b }) =>
          Number(b.flags & ProductFlags.OrphanedComponents) - Number(a.flags & ProductFlags.OrphanedComponents)
      )
    })
  }, [data, isFetching])

  return { isFetching, rows, groupsById, subgroupsById }
}
