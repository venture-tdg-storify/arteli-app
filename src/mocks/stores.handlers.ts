import { delay, http, HttpResponse } from 'msw'
import queryString from 'query-string'
import { stores } from './data/stores'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/${path}`

export const handlers = [
  http.get(url(`stores`), async ({ request: { url } }) => {
    const ids = queryString.parse(url.split('?')[1]).ids
    await delay()

    if (ids) {
      return HttpResponse.json(stores.filter((s) => ids.includes(s.id)))
    }

    return HttpResponse.json(stores)
  })
]
