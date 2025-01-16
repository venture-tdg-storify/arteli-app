import { delay, http, HttpResponse } from 'msw'
import queryString from 'query-string'
import { users } from '$/mocks/data/users'
import { handlers as meHandlers } from '$/mocks/me.handlers'
import { domain } from '@/config/auth.config'
import { handlers as categoriesHandlers } from './categories.handlers'
import { actionStores } from './data/actionStores'
import { addRecGroups } from './data/addRecGroups'
import { addRecommendations } from './data/addRecommendations'
import { AddRecProducts } from './data/addRecProducts'
import { addRecSubgroups } from './data/addRecSubgroups'
import { auth0User } from './data/authUser'
import { groups } from './data/groups'
import { products } from './data/products'
import { recommendationSets } from './data/recommendationSets'
import { recommendationStores } from './data/recommendationStores'
import { rejections } from './data/rejections'
import { removeRecommendations } from './data/removeRecommendations'
import { subgroups } from './data/subgroups'
import { tags } from './data/tags'
import { tenantSettings } from './data/tenantSettings'
import { userJobs } from './data/userJobs'
import { actionSets, Response } from './default.scenario'
import { handlers as storesHandlers } from './stores.handlers'
import { handlers as subcategoriesHandlers } from './subcategories.handlers'
import { handlers as userJobsHandlers } from './userJob.handlers'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/${path}`

export const handlers = [
  ...meHandlers,
  ...categoriesHandlers,
  ...subcategoriesHandlers,
  ...storesHandlers,
  ...userJobsHandlers,
  http.get(`https://${domain}/api/v2/users/650c50b9da1617bd4ee9547b`, async () => {
    return HttpResponse.json(auth0User)
  }),

  http.get(url(`action-stores`), async ({ request: { url } }) => {
    const params = queryString.parse(url.split('?')[1])
    const setIds = params.setIds
    const setFinalizedAtTo = params.setFinalizedAtTo

    await delay()

    if (setFinalizedAtTo) {
      if (setFinalizedAtTo.includes('2024-04-24T2')) {
        return HttpResponse.json(Response(actionStores.filter((s) => s.setId === actionSets.Finalized.id)))
      }
    }

    if (setIds) {
      return HttpResponse.json(Response(actionStores.filter((s) => setIds.includes(s.setId))))
    }

    console.log('Not Found', 'Can not find action-stores')

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.get(url(`groups`), async ({ request: { url } }) => {
    const parsed = queryString.parse(url.split('?')[1])
    const ids = parsed.ids
    const search = parsed.search
    await delay()

    if (ids) {
      return HttpResponse.json(Response(groups.filter((g) => ids.includes(g.id))))
    }

    if (typeof search === 'string') {
      return HttpResponse.json(Response(groups.filter((g) => g.name.includes(search))))
    }

    console.log('Not Found', 'Can not find groups')

    return HttpResponse.json(groups)
  }),

  http.get(url(`groups/:id`), async ({ params: { id } }) => {
    await delay()

    if (id) {
      return HttpResponse.json(Response(groups.filter((g) => id === g.id)))
    }

    console.log('Not Found', 'Can not find group')

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.get(url(`subgroups`), async ({ request: { url } }) => {
    const ids = queryString.parse(url.split('?')[1]).ids
    await delay()

    if (ids) {
      return HttpResponse.json(Response(subgroups.filter((g) => ids.includes(g.id))))
    }

    console.log('Not Found', 'Can not find subgroups')

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.get(url(`products`), async ({ request: { url } }) => {
    const ids = queryString.parse(url.split('?')[1]).ids
    await delay()

    if (ids) {
      return HttpResponse.json(Response(products.filter((g) => ids.includes(g.id))))
    }

    console.log('Not Found', 'Can not find products')

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.get(url(`recs/:actionType/:categoryId`), async ({ params: { categoryId, actionType }, request: { url } }) => {
    const params = queryString.parse(url.split('?')[1])
    await delay()

    if (actionType === 'Add' && categoryId === '3.C.TW') {
      if (params.groupIds) {
        return HttpResponse.json(Response(addRecommendations.filter((r) => params.groupIds?.includes(r.groupId))))
      }
      if (params.fromRank === '15') {
        return HttpResponse.json(Response([]))
      }
      return HttpResponse.json(Response(addRecommendations))
    }

    if (actionType === 'Remove' && categoryId === '3.C.TW') {
      return HttpResponse.json(Response(removeRecommendations))
    }

    return HttpResponse.json(Response([]))
  }),

  http.get(url(`rejections`), async ({ request: { url } }) => {
    const params = queryString.parse(url.split('?')[1])
    await delay()

    if (params.categoryId && params.storeIds) {
      return HttpResponse.json(
        Response(rejections.filter((r) => r.categoryId === params.categoryId && r.storeId === params.storeIds))
      )
    }
    return HttpResponse.json(Response([]))
  }),

  http.get(url(`rec-stores/:actionType`), async ({ params: { actionType } }) => {
    await delay()

    if (actionType === 'Remove') {
      return HttpResponse.json(Response(recommendationStores))
    }

    if (actionType === 'Add') {
      return HttpResponse.json(Response([]))
    }

    console.log('Not Found', 'Can not find Recommendation Stores')

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.get(url(`action-sets`), async () => {
    await delay()

    return HttpResponse.json(Response(Object.values(actionSets)))
  }),

  http.get(url(`action-sets/:id`), async ({ params: { id } }) => {
    await delay()

    if (id === '1.AS.0J') {
      return HttpResponse.json(actionSets.Finalized)
    }
    return HttpResponse.json(actionSets.Started)
  }),

  http.get(url(`action-sets/active`), async () => {
    await delay()

    return HttpResponse.json(actionSets.Started)
  }),

  http.get(url(`action-sets/:actionSetId/action-stores`), async ({ params: { actionSetId } }) => {
    await delay()

    if (actionSets.Finalized.id === actionSetId || actionSets.Started.id === actionSetId) {
      return HttpResponse.json(Response([]))
    }

    console.log('Not Found', 'Can not find action-stores for action set: ', actionSetId)

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.get(url(`tenant-users`), async () => {
    // https://mswjs.io/docs/recipes/query-parameters/#read-a-single-parameter
    await delay()

    return HttpResponse.json(Response(users))
  }),

  http.get(url('rec-sets/active'), async () => {
    await delay()

    return HttpResponse.json(recommendationSets)
  }),

  http.post(
    'https://app-arteli-core-stage-eastus2.azurewebsites.net/api/action-stores',
    async () => HttpResponse.json([]) // TODO: Add  store to active action set
  ),

  http.get(url('tenant-settings'), async () => {
    await delay()

    return HttpResponse.json(tenantSettings)
  }),

  http.put(url('tenant-settings'), async () => {
    await delay()

    return new HttpResponse(JSON.stringify(tenantSettings), { status: 200, statusText: 'OK' })
  }),

  http.get(url(`user-jobs`), async () => {
    await delay()

    return HttpResponse.json(userJobs)
  }),

  http.put(url('action-sets/active/finalize'), async () => {
    await delay()

    return new HttpResponse(JSON.stringify(tenantSettings), { status: 200, statusText: 'OK' })
  }),

  http.get(url(`rec-notes`), async () => {
    await delay()

    return HttpResponse.json([])
  }),
  http.get(url(`add-recs/categories/:categoryId/groups`), async ({ params: { categoryId } }) => {
    await delay()

    if (categoryId === '3.C.TW') {
      return HttpResponse.json(Response(addRecGroups))
    }
    return HttpResponse.json(Response([]))
  }),
  http.get(
    url(`add-recs/categories/:categoryId/groups/:groupId/subgroups`),
    async ({ params: { categoryId, groupId } }) => {
      await delay()

      if (categoryId === '3.C.TW' && groupId === '1849.G.co') {
        return HttpResponse.json(Response(addRecSubgroups))
      }
      return HttpResponse.json(Response([]))
    }
  ),
  http.get(
    url(`add-recs/categories/:categoryId/groups/:groupId/subgroups/:subgroupId/products`),
    async ({ params: { categoryId, groupId, subgroupId } }) => {
      await delay()

      if (categoryId === '3.C.TW' && groupId === '1849.G.co' && subgroupId === '3315.S.K4') {
        return HttpResponse.json(Response(AddRecProducts))
      }
      return HttpResponse.json(Response([]))
    }
  ),
  http.get(url(`products/tags`), async () => {
    return HttpResponse.json(Response(tags))
  })
]
