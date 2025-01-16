import type { Tenant } from '$/api/system'
import { getByProperty } from '@/utils'

export const tenants: Tenant[] = [
  {
    id: '4!T-mhErmw',
    name: 'Admin Fox',
    isActive: true,
    internalId: 'be39227c-20a5-4975-9394-154a2019327',
    defaultTimeZone: 'America/Panama',
    flags: 0,
    labels: {}
  },
  {
    id: 'm1!T-mhErw',
    name: 'Advicure',
    isActive: true,
    internalId: '427047e2-c169-5f77-90cf-f74014778e02',
    defaultTimeZone: 'Europe/Paris',
    flags: 0,
    labels: {}
  },
  {
    id: '2!T-mhErmw',
    name: 'Whizzle',
    isActive: false,
    internalId: '427047e2-c169-5f77-90cf-f74014778e03',
    defaultTimeZone: 'America/Mexico_City',
    flags: 0,
    labels: {}
  },
  {
    id: '3!T-mhErmw',
    name: 'Everdust',
    isActive: true,
    internalId: 'e6f8c36c-9a2a-4f64-8f06-dafa59e9baf8',
    defaultTimeZone: 'Pacific/Midway',
    flags: 0,
    labels: {}
  }
]

export const getTenantById = getByProperty(tenants, 'id')
