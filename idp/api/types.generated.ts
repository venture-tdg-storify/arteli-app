export type Me = {
  currentTenantUserId: TenantUser['id'] | null
  user: User
  tenantUsers: TenantUser[]
  tenants: Tenant[]
}

export type MeUpdate = {
  pictureUrl: string | null
}

export type ProblemDetails = {
  type: string | null
  title: string | null
  status: number | null
  detail: string | null
  instance: string | null
}

export type TenantCreate = {
  isActive: boolean
  internalId: string
  name: string
  flags: number
  defaultTimeZone: string
  labels: object
}

export enum TenantCreateFlags {
  None = 0
}

export type Tenant = {
  id: Id<'id-arteli-idp-data-entities-tenant'> | string
  isActive: boolean
  internalId: string
  name: string
  flags: number
  defaultTimeZone: string
  labels: object
}

export enum TenantFlags {
  None = 0
}

export type TenantUpdate = {
  isActive: boolean
  name: string
  defaultTimeZone: string
  labels: object
}

export type TenantUserCreate = {
  tenantId: Tenant['id']
  userId: UserUpdate['id']
  isActive: boolean
  roles: number
  categoryExternalIds: string[]
  storeExternalIds: string[]
}

export enum TenantUserCreateRoles {
  None = 0,
  UserManagement = 1,
  Writer = 2,
  FinalizeActionSet = 4,
  DeleteActionSet = 8,
  EmailNotifications = 16,
  TenantSettingsManagement = 32,
  UserJobManagement = 64
}

export type TenantUser = {
  id: Id<'id-arteli-idp-data-entities-tenantuser'> | string
  tenantId: Tenant['id']
  userId: UserUpdate['id']
  isActive: boolean
  roles: number
  categoryExternalIds: string[]
  storeExternalIds: string[]
  allStores: boolean
  allCategories: boolean
}

export enum TenantUserRoles {
  None = 0,
  UserManagement = 1,
  Writer = 2,
  FinalizeActionSet = 4,
  DeleteActionSet = 8,
  EmailNotifications = 16,
  TenantSettingsManagement = 32,
  UserJobManagement = 64
}

export type TenantUserUpdate = {
  isActive: boolean
  roles: number
  categoryExternalIds: string[]
  storeExternalIds: string[]
}

export enum TenantUserUpdateRoles {
  None = 0,
  UserManagement = 1,
  Writer = 2,
  FinalizeActionSet = 4,
  DeleteActionSet = 8,
  EmailNotifications = 16,
  TenantSettingsManagement = 32,
  UserJobManagement = 64
}

export type UserCreate = {
  isActive: boolean
  email: string
  name: string
  roles: number
}

export enum UserCreateRoles {
  None = 0,
  Staff = 1
}

export type User = {
  id: Id<'id-arteli-idp-data-entities-user'> | string
  isActive: boolean
  email: string
  name: string
  pictureUrl: string | null
  roles: number
  updatedAt: string
}

export enum UserRoles {
  None = 0,
  Staff = 1
}

export type UserUpdate = {
  id: Id<'id-arteli-idp-data-entities-user'> | string
  isActive: boolean
  email: string
  name: string
  roles: number
}

export enum UserUpdateRoles {
  None = 0,
  Staff = 1
}

export type Id<T extends string> = string & {
  readonly __brand: T
}
