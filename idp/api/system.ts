import type { AuthorizationHeaders, TracingHeaders } from './middlewares'
import type {
  Tenant,
  TenantUpdate,
  TenantUser,
  TenantCreate,
  TenantUserCreate,
  TenantUserUpdate,
  User,
  UserCreate,
  UserUpdate,
  Me,
  MeUpdate
} from './types.generated'
import type { PaginatedRequest } from '@/api/arteli'
import { Api, withBaseUrl, withDefaultHeaders, withDynamicUrl } from '@arteli/http'
import { withGlobalAuthorization, withTracingId } from './middlewares'

type DefaultHeaders = AuthorizationHeaders & TracingHeaders

export * from './types.generated'

const systemApi = Api<DefaultHeaders>()
  .useBefore(withDynamicUrl())
  .useBefore(withBaseUrl(`${import.meta.env.VITE_SYSTEM_API}/system`))
  .useBefore(withGlobalAuthorization)
  .useBefore(withTracingId)
  .useBefore(withDefaultHeaders({ 'Content-Type': 'application/json', accept: 'application/json, text/plain, */*' }))

const meApi = Api<DefaultHeaders>()
  .useBefore(withDynamicUrl())
  .useBefore(withBaseUrl(`${import.meta.env.VITE_SYSTEM_API}`))
  .useBefore(withGlobalAuthorization)
  .useBefore(withTracingId)
  .useBefore(withDefaultHeaders({ 'Content-Type': 'application/json', accept: 'application/json, text/plain, */*' }))

export const System = {
  Tenants: {
    findAll: systemApi.Get<Tenant[], PaginatedRequest<{ ids: Tenant['id'][] }>>('tenants'),
    add: systemApi.Post<Tenant, TenantCreate>('tenants'),
    findOne: systemApi.Get<Tenant, { id: Tenant['id'] }>('tenants/:id'),
    update: systemApi.Put<Tenant, TenantUpdate, { id: Tenant['id'] }>('tenants/:id')
  },
  TenantUsers: {
    findAll: systemApi.Get<
      TenantUser[],
      PaginatedRequest<{
        ids?: TenantUser['id'][]
        userIds?: User['id'][]
        tenantIds?: Tenant['id'][]
        email?: User['email']
        name?: User['name']
        isActive?: User['isActive']
      }>
    >('tenant-users'),
    add: systemApi.Post<TenantUser, TenantUserCreate>('tenant-users'),
    findOne: systemApi.Get<TenantUser, { id: TenantUser['id'] }>('tenant-users/:id'),
    update: systemApi.Put<TenantUser, TenantUserUpdate, { id: Tenant['id'] }>('tenant-users/:id')
  },
  Users: {
    findAll: systemApi.Get<User[], PaginatedRequest<{ ids: string[] }>>('users'),
    add: systemApi.Post<User, UserCreate>('users'),
    findOne: systemApi.Get<User, { id: User['id'] }>('users/:id'),
    update: systemApi.Put<User, UserUpdate, { id: User['id'] }>('users/:id')
  }
}

export const MeApi = {
  getMe: meApi.Get<Me>('me'),
  update: meApi.Put<Me, MeUpdate>('me')
}
