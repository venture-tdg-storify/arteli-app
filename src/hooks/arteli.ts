import type { Category, Group, Product, Store, Subcategory, Subgroup, TenantUser } from '@/api/arteli'
import api from '@/api'
import { allIdsQuery, fetchAllIdsFactory } from '@/utils/allIdsQuery'
import { allItemsQuery } from '@/utils/allItemsQuery'
import { InMemoryCache } from '@/utils/InMemoryCache'

const _5_MINUTES = 5 * 60 * 1000

export const useAllStores = allItemsQuery(api.Arteli.Stores.findAll, { staleTime: _5_MINUTES })

export const useAllRelevantCategories = allItemsQuery(
  api.Arteli.Categories.findAll.select((response) => response.body.filter((_) => _.isInActiveRecSet), 'relevant'),
  { staleTime: _5_MINUTES }
)

export const useAllRelevantSubcategories = allItemsQuery(
  api.Arteli.Subcategories.findAll.select((response) => response.body.filter((_) => _.isInActiveRecSet), 'relevant'),
  { staleTime: _5_MINUTES }
)

export const useAllRecommendationStores = allItemsQuery(api.Arteli.Recs.getRecStores)

export const useActiveRecommendationSet = api.Arteli.Recs.getActiveSet.asQuery({ defaultStaleTime: _5_MINUTES })

const $products = new InMemoryCache<Product>()
const $groups = new InMemoryCache<Group>()
const $subgroups = new InMemoryCache<Subgroup>()
const $users = new InMemoryCache<TenantUser>()
const $categories = new InMemoryCache<Category>()
const $subcategories = new InMemoryCache<Subcategory>()
const $stores = new InMemoryCache<Store>()

export const fetchAllStoresByIds = fetchAllIdsFactory({
  cache: $stores,
  handler: api.Arteli.Stores.findAll
})
export const fetchAllProductsByIds = fetchAllIdsFactory({
  cache: $products,
  handler: api.Arteli.Products.findAll
})
export const fetchAllCategoriesByIds = fetchAllIdsFactory({
  cache: $categories,
  handler: api.Arteli.Categories.findAll
})
export const fetchAllSubcategoriesByIds = fetchAllIdsFactory({
  cache: $subcategories,
  handler: api.Arteli.Subcategories.findAll
})
export const fetchAllGroupsByIds = fetchAllIdsFactory({ cache: $groups, handler: api.Arteli.Groups.findAll })
export const fetchAllSubgroupsByIds = fetchAllIdsFactory({ cache: $subgroups, handler: api.Arteli.Subgroups.findAll })
export const fetchAllUsersByIds = fetchAllIdsFactory({ cache: $users, handler: api.Arteli.Users.findAll })

export const useProductsByIdsQuery = allIdsQuery(api.Arteli.Products.findAll, $products)
export const useStoresByIdsQuery = allIdsQuery(api.Arteli.Stores.findAll, $stores)
export const useGroupsByIdsQuery = allIdsQuery(api.Arteli.Groups.findAll, $groups)
export const useSubGroupsByIdsQuery = allIdsQuery(api.Arteli.Subgroups.findAll, $subgroups)
export const useUserByIdsQuery = allIdsQuery(api.Arteli.Users.findAll, $users)

export const useAllRejections = allItemsQuery(api.Arteli.Rejections.findAll)
export const useRecGroupQuery = api.Arteli.Recs.getRecGroups.asQuery()

export const useGroupQuery = api.Arteli.Groups.findOne.asQuery({ defaultStaleTime: _5_MINUTES })

export const useAllActionStoresQuery = allItemsQuery(api.Arteli.ActionStores.findAll)

export const useActionStoresQuery = api.Arteli.ActionStores.findAll.asQuery()

export const useAllActionSets = allItemsQuery(api.Arteli.ActionSets.findAll)
