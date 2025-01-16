import type { Tenant } from '$/api/system'
import { delay, http, HttpResponse } from 'msw'
import { tenants } from './data/tenants'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/system/${path}`

export const handlers = [
  http.get(url('tenants'), async () => HttpResponse.json(tenants.sort((a, b) => a.name!.localeCompare(b.name!)))),

  http.post(url('tenants'), async ({ request }) => {
    const tenant = (await request.json()) as Tenant
    await delay()
    return HttpResponse.json(tenant)
  }),

  http.get(url('tenants/:id'), async ({ params: { id } }) => {
    await delay()

    const t = tenants.find((t) => t.id === id)
    if (t?.id) {
      return HttpResponse.json(t)
    }

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.put<{ id: string }>(url('tenants/:id'), async ({ params: { id }, request }) => {
    const tenant = (await request.json()) as Tenant
    await delay()
    return HttpResponse.json({ ...tenant, id })
  })
]
