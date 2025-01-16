import { getTenantById } from './tenants'
import { getTenantUserById } from './tenantUsers'
import { getUserById } from './users'

export const me = {
  currentTenantUserId: null,
  user: getUserById('1!U-mhErmw'),
  tenantUsers: [getTenantUserById('1!TU-mhErmw'), getTenantUserById('2!TU-mhErmw')],
  tenants: [getTenantById('m1!T-mhErw'), getTenantById('2!T-mhErmw')]
}
