import { delay, http, HttpResponse } from 'msw'
import { categories } from './data/categories'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/${path}`

export const handlers = [
  http.get(url('categories/:categoryId'), async ({ params: { categoryId } }) => {
    await delay()

    const category = categories.find((category) => category.id === categoryId)

    if (category) {
      return new HttpResponse(JSON.stringify(category), { status: 200, statusText: 'OK' })
    }

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),
  http.get(url('categories'), async () => {
    await delay()

    return HttpResponse.json(categories)
  }),
  http.put(url('categories/:categoryId'), async ({ params: { categoryId } }) => {
    await delay()

    const category = categories.find((category) => category.id === categoryId)

    if (category) {
      return new HttpResponse(JSON.stringify(category), { status: 200, statusText: 'OK' })
    }

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  })
]
