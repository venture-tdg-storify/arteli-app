import { delay, http, HttpResponse } from 'msw'
import { subcategories } from './data/subcategories'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/${path}`

// TODO: Add filtering by request ids
export const handlers = [
  http.get(url('subcategories'), async () => {
    await delay()

    return HttpResponse.json(subcategories)
  }),
  http.get(url('subcategories/:subcategoryId'), async ({ params: { subcategoryId } }) => {
    await delay()

    const subcategory = subcategories.find((subcategory) => subcategory.id === subcategoryId)

    if (subcategory) {
      return HttpResponse.json(subcategory)
    }

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  })
]
