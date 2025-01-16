import { http, HttpResponse } from 'msw'
import { tenantUsers } from './data/tenantUsers'

const url = (path: string) => `${import.meta.env.VITE_SYSTEM_API}/system/${path}`

export const handlers = [
  http.get(url('tenant-users'), async () => {
    // TODO: Implement filtering
    return HttpResponse.json(tenantUsers)
  }),

  http.post(url('tenant-users'), async () => {
    return HttpResponse.json(tenantUsers[0])
  }),

  http.get(url('tenant-users/:id'), async ({ params: { id } }) => {
    const tenant = tenantUsers.find((tenantUser) => tenantUser.id === id)

    if (tenant) {
      return HttpResponse.json(tenant)
    }

    console.log('Not Found', 'Can not find TenantUser with id: ', id)

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  }),

  http.put(url('tenant-users/:id'), async ({ params: { id } }) => {
    const tenant = tenantUsers.find((tenantUser) => tenantUser.id === id)

    if (tenant) {
      return HttpResponse.json(tenant)
    }

    console.log('Not Found', 'Can not find TenantUser with id: ', id)

    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
  })
]
