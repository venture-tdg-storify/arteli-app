import { TenantUserRoles, type TenantUser } from '$/api/system'
import { getByProperty } from '@/utils'

export const tenantUsers: TenantUser[] = [
  {
    id: '1!TU-mhErmw',
    userId: '1!U-mhErmw',
    isActive: true,
    roles: TenantUserRoles.FinalizeActionSet,
    categoryExternalIds: ['*'],
    storeExternalIds: ['*'],
    tenantId: 'm1!T-mhErw',
    allStores: true,
    allCategories: true
  },
  {
    id: '2!TU-mhErmw',
    userId: '2!U-mhErmw',
    isActive: true,
    roles:
      TenantUserRoles.UserManagement &
      TenantUserRoles.Writer &
      TenantUserRoles.FinalizeActionSet &
      TenantUserRoles.DeleteActionSet &
      TenantUserRoles.EmailNotifications &
      TenantUserRoles.TenantSettingsManagement,
    categoryExternalIds: ['*'],
    storeExternalIds: ['*'],
    tenantId: 'm1!T-mhErw',
    allStores: true,
    allCategories: true
  },
  {
    id: '3!TU-mhErmw',
    userId: '3!U-mhErmw',
    isActive: true,
    roles: TenantUserRoles.None,
    categoryExternalIds: [],
    storeExternalIds: [],
    tenantId: 'm1!T-mhErw',
    allStores: true,
    allCategories: true
  },
  {
    id: '4!TU-mhErmw',
    userId: '4!U-mhErmw',
    isActive: true,
    roles: TenantUserRoles.None,
    categoryExternalIds: [],
    storeExternalIds: [],
    tenantId: 'm1!T-mhErw',
    allStores: true,
    allCategories: true
  }
]

export const getTenantUserById = getByProperty(tenantUsers, 'id')
