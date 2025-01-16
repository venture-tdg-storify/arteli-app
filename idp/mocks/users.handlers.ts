import type { User } from '$/api/system'
import { delay, http, HttpResponse } from 'msw'
import { users } from './data/users'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/system/${path}`

export const handlers = [
  http.get(url('users'), async () => {
    return HttpResponse.json(users.sort((a, b) => a.name!.localeCompare(b.name!)))
  }),

  http.get(url('users/:id'), async ({ params: { id } }) => {
    await delay()

    const t = users.find((t) => t.id === id)
    if (t) {
      return HttpResponse.json(t)
    }

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.put<{ id: string }>(url('users/:id'), async ({ params: { id }, request }) => {
    const user = (await request.json()) as User
    await delay()
    return HttpResponse.json({ ...user, id })
  }),

  http.post(url('users'), async ({ request }) => {
    const user = (await request.json()) as User
    await delay()
    return HttpResponse.json(user)
  })
]
