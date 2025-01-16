import type { ActionStore, Category, Group, Product, RecStore, Store, Subcategory } from '@/api/arteli'
import { groupById, groupByProperty } from '@arteli/utils'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'
import {
  fetchAllCategoriesByIds,
  fetchAllGroupsByIds,
  fetchAllProductsByIds,
  fetchAllStoresByIds,
  fetchAllSubcategoriesByIds
} from '@/hooks/arteli'
import { groupByPropertyMulti, mapObject, unique } from '@/utils'
import { fetchAllFactory } from '@/utils/allItemsQuery'

export type ActionStoreStatus = 'Now on floor' | 'No longer on floor' | 'Inactive Series'

export type ActionStoreRow = {
  id: ActionStore['id']
  store: Store
  actionStore: ActionStore
  category: Category
  subcategory?: Subcategory
  group: Group
  status?: ActionStoreStatus
  overdueDate: string | null
  dependantActionStore: ActionStore | null
  recStore?: RecStore
  product?: Product
  borderTop?: boolean
}

const initialData: ActionStoreRow[] = [] as ActionStoreRow[]

function getStatus(actionStore: ActionStore): ActionStoreStatus | undefined {
  if (actionStore.actionType === 'Add' && actionStore.completionStatus === 'Completed') return 'Now on floor'
  if (actionStore.actionType === 'Add' && actionStore.completionStatus === 'Inactive') return 'Inactive Series'
  if (actionStore.actionType === 'Remove' && actionStore.completionStatus === 'Completed') return 'No longer on floor'
  return undefined
}

const fetchAllActionStores = fetchAllFactory({ handler: api.Arteli.ActionStores.findAll })
const fetchAllRecStores = fetchAllFactory({ handler: api.Arteli.Recs.getRecStores })

export const useActionStoreRowsQuery = ({
  params,
  enabled,
  refetchOnMount,
  refetchOnWindowFocus,
  staleTime,
  gcTime
}: Parameters<typeof api.Arteli.ActionStores.findAll>[0] & {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  meta?: unknown
  staleTime?: number
  refetchOnMount?: boolean
  gcTime?: number
} = {}) =>
  useQuery({
    initialData,
    queryKey: ['rows', ...api.Arteli.ActionStores.findAll.getQueryKey(params)],
    refetchOnWindowFocus,
    refetchOnMount,
    staleTime,
    gcTime,
    queryFn: async ({ signal }) => {
      const actionStores = await fetchAllActionStores({ signal, params })

      if (actionStores.length === 0) {
        return initialData
      }

      const storeIds = unique(actionStores.map(({ storeId }) => storeId))
      const groupIds = unique(actionStores.map(({ groupId }) => groupId))
      const categoryIds = unique(actionStores.map(({ categoryId }) => categoryId))
      const subcategoryIds = unique(
        actionStores.map(({ subcategoryId }) => subcategoryId).filter(Boolean) as Subcategory['id'][]
      )
      const productIds = unique(actionStores.flatMap(({ productIds }) => productIds))

      const [stores, groups, categories, subcategories, products, recStores] = await Promise.all([
        fetchAllStoresByIds({ params: { ids: storeIds, includeInactive: true } }),
        fetchAllGroupsByIds({ params: { ids: groupIds } }),
        fetchAllCategoriesByIds({ params: { ids: categoryIds } }),
        fetchAllSubcategoriesByIds({ params: { ids: subcategoryIds as string[] } }),
        fetchAllProductsByIds({ params: { ids: productIds } }),
        fetchAllRecStores({ params: { storeIds, actionType: 'Add', productIds } })
      ])

      const actionStoresById = groupById(actionStores)
      const groupsById = groupById(groups)
      const categoriesById = groupById(categories)
      const subcategoriesById = groupById(subcategories)
      const storesById = groupById(stores)
      const productsById = groupById(products)
      const recStoresByStoreByProduct = mapObject(groupByPropertyMulti(recStores, 'storeId'), (_) =>
        groupByProperty(_, 'productId')
      )

      const actionStoresByStore = mapObject(groupByPropertyMulti(actionStores, 'storeId'), (_) =>
        _.filter((_) => _.actionType === 'Add')
          .sort((a, b) => (b.predictedSales ?? -1) - (a.predictedSales ?? -1))
          .flatMap((_) => (_.dependentId ? [_, actionStoresById[_.dependentId]] : _))
          .flatMap((actionStore, index) => {
            const store = storesById[actionStore.storeId]
            const category = categoriesById[actionStore.categoryId]
            const subcategory = actionStore.subcategoryId ? subcategoriesById[actionStore.subcategoryId] : undefined
            const group = groupsById[actionStore.groupId]
            const status = getStatus(actionStore)
            const dependantActionStore = actionStore.dependentId ? actionStoresById[actionStore.dependentId] : null

            const actionStoreRow = {
              store,
              actionStore,
              category,
              subcategory,
              group,
              status,
              dependantActionStore,
              overdueDate: null,
              id: actionStore.id
            } as ActionStoreRow

            if (actionStore.actionType === 'Add') {
              const actionStoreProducts = actionStore.productIds.map((id) => productsById[id])
              const recStoresByProductId = recStoresByStoreByProduct[store.id] ?? {}

              return [
                { ...actionStoreRow, borderTop: index !== 0 },
                ...actionStoreProducts
                  .filter((product) => {
                    const recStore = recStoresByProductId[product.id]

                    return (
                      Boolean(recStore) &&
                      product.categoryId === actionStore.categoryId &&
                      (!actionStore.subcategoryId || product.subcategoryId === actionStore.subcategoryId)
                    )
                  })
                  .map((product) => ({
                    ...actionStoreRow,
                    product,
                    recStore: recStoresByProductId[product.id],
                    category: categoriesById[product.categoryId],
                    subcategory: product.subcategoryId ? subcategoriesById[product.subcategoryId] : undefined,
                    id: `${actionStore.id}-${product.id}`
                  }))
                  .sort((a, b) => (b.recStore?.predictedSales ?? -1) - (a.recStore?.predictedSales ?? -1))
              ]
            }

            return actionStoreRow
          })
      )

      return Object.values(actionStoresByStore)
        .flat()
        .sort((a, b) => a.store.externalId?.localeCompare(b.store.externalId ?? '') ?? 0)
    },
    enabled
  })
