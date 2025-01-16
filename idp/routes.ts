import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const Tenants = lazy(() => import('$/pages/Tenants'))
const TenantsPanel = lazy(() => import('$/pages/Tenants/components/TenantPanel'))
const TenantUserPanel = lazy(() => import('$/pages/Tenants/components/TenantUserPanel'))
const Users = lazy(() => import('$/pages/Users'))
const UserPanel = lazy(() => import('$/pages/Users/components/UserPanel'))

export const PATH_HOME = '/'

export const PATH_TENANT_ID = ':tenantId'
export const PATH_TENANT_USER_ID = ':tenantUserId'
export const PATH_USER_ID = ':userId'

export const PATH_EDIT = 'edit'
export const PATH_CREATE = 'create'

export const PATH_USERS = 'users'
export const PATH_TENANT_USERS = 'tenant-users'

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Tenants,
    children: [
      {
        path: PATH_CREATE,
        Component: TenantsPanel
      }
    ]
  },
  {
    path: PATH_TENANT_ID,
    Component: Tenants,
    children: [
      {
        path: PATH_EDIT,
        Component: TenantsPanel
      },
      {
        path: PATH_CREATE,
        Component: TenantsPanel
      },
      {
        path: `${PATH_TENANT_USERS}/${PATH_CREATE}`,
        Component: TenantUserPanel
      },
      {
        path: `${PATH_TENANT_USERS}/${PATH_TENANT_USER_ID}`,
        Component: TenantUserPanel
      }
    ]
  },
  {
    path: PATH_USERS,
    Component: Users,
    children: [
      {
        path: PATH_CREATE,
        Component: UserPanel
      },
      {
        path: PATH_USER_ID,
        Component: UserPanel
      }
    ]
  }
]

export default routes
