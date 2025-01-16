import type { AuthorizationHeaders, TracingHeaders } from './middlewares'
import { Api, withBaseUrl, withDefaultHeaders, withDynamicUrl } from '@arteli/http'
import { contentTypeHeaders } from '@arteli/http/src/middlewares'
import { withGlobalAuthorization, withTracingId } from './middlewares'
import {
  type RecGroup,
  type TenantSettings,
  type TenantSettingsUpdate,
  type ActionSetTypesStatus,
  type ActionSet,
  type ActionStoreCreate,
  type ActionStore,
  type ActionType,
  type Category,
  type CategoryUpdate,
  type ClientRank,
  type Group,
  type Product,
  type RecSet,
  type RecStore,
  type RejectionCreate,
  type Rejection,
  type RecNote,
  type RecNoteCreate,
  type RecNoteUpdate,
  type Store,
  type Subcategory,
  type Subgroup,
  type TenantUser,
  type UserJob,
  type ActionSetFinalize,
  type AddRecGroup,
  type AddRecSubgroup,
  type AddRecProduct,
  type ActionStoreCreateMulti,
  type CategoryPerf,
  type ProductTag,
  type ActionSetUpdate,
  type RecStoreFlags,
  type ActionStorePerf,
  RecGroupRecStoreFlagsAll
} from './types.generated'
export * from './types.generated'

export type RecommendationSet = RecSet
export type ActionSetStatus = ActionSetTypesStatus
export const RecGroupRecStoreFlags = RecGroupRecStoreFlagsAll

type DefaultHeaders = AuthorizationHeaders & TracingHeaders

type UIConfig = {
  selectWebApp?: {
    recommendationUiFilters?: { [key: string]: ActionType[] }
    recommendationUiDisplay?: { [key: string]: boolean }
    seriesPerformanceReportUI: { showRemoved: boolean }
  }
}

export type TenantSettingsWithUiConfig = TenantSettings & {
  uiConfig: UIConfig
}

export type TenantSettingsUpdateWithUiConfig = TenantSettingsUpdate & {
  uiConfig: UIConfig
}

const arteliApi = Api<DefaultHeaders>()
  .useBefore(withDynamicUrl())
  .useBefore(withBaseUrl(import.meta.env.VITE_ARTELI_API))
  .useBefore(withGlobalAuthorization)
  .useBefore(withTracingId)
  .useBefore(withDefaultHeaders({ accept: 'application/json, text/plain, */*' }))
  .useBefore(contentTypeHeaders)

export const Arteli = {
  ActionSets: {
    findAll: arteliApi.Get<ActionSet[], PaginatedRequest<{ statuses?: ActionSetStatus[]; ids?: ActionSet['id'][] }>>(
      'action-sets'
    ),
    findOne: arteliApi.Get<ActionSet, { id: ActionSet['id'] }>('action-sets/:id'),
    getActive: arteliApi.Get<ActionSet>('action-sets/active'),
    finalize: arteliApi.Put<ActionSet, ActionSetFinalize>('action-sets/active/finalize'),
    remove: arteliApi.Delete<null, { id: ActionSet['id'] }>('action-sets/:id'),
    update: arteliApi.Put<ActionSet, ActionSetUpdate, { id: ActionSet['id'] }>('action-sets/:id')
  },
  ActionStores: {
    findAll: arteliApi.Get<
      ActionStore[],
      PaginatedRequest<{
        setIds?: ActionSet['id'][]
        ids?: ActionStore['id'][]
        categoryIds?: Category['id'][]
        subcategoryIds?: Subcategory['id'][]
        groupIds?: Group['id'][]
        storeIds?: Store['id'][]
        setFinalizedAtFrom?: string
        setFinalizedAtTo?: string
      }>
    >('action-stores'),
    add: arteliApi.Post<ActionStore[], ActionStoreCreate>('action-stores'),
    addMulti: arteliApi.Post<ActionStore[], ActionStoreCreateMulti>('action-stores/multi'),
    remove: arteliApi.Delete<null, { id: ActionStore['id'] }>('action-stores/:id'),
    update: arteliApi.Put<ActionStore, ActionStoreCreate, { id: ActionStore['id'] }>('action-stores/:id'),
    updateNote: arteliApi.Put<ActionStore, string, { id: ActionStore['id'] }>('action-stores/:id/note')
  },
  Products: {
    findAll: arteliApi.Get<Product[], PaginatedRequest<{ ids?: Product['id'][]; includeInactive?: boolean }>>(
      'products'
    ),
    findOne: arteliApi.Get<Product, { id: Product['id'] }>('products/:id')
  },
  Perf: {
    byCategory: arteliApi.Get<CategoryPerf[], { fromDate: string; toDate: string }>('perf/by-category'),
    byActionStore: arteliApi.Get<
      ActionStorePerf[],
      { fromDate: string; toDate: string; categoryId?: Category['id']; storeIds: Store['id'][] }
    >('perf/by-action-store')
  },
  Recs: {
    getAddRecGroups: arteliApi.Get<
      AddRecGroup[],
      PaginatedRequest<{
        categoryId: Category['id']
        storeIds: Store['id'][]
        subcategoryIds: Subcategory['id'][]
        groupIds?: Group['id'][]
        // excludeGroupTags?: number // Not Used
        excludeRecentlyRemoved?: boolean
        excludeNegative?: boolean
      }>
    >('add-recs/categories/:categoryId/groups'),
    getAddRecSubgroups: arteliApi.Get<
      AddRecSubgroup[],
      {
        categoryId: Category['id']
        groupId: Group['id']
        storeIds: Store['id'][]
        subcategoryIds: Subcategory['id'][]
        subgroupId?: Subgroup['id']
      }
    >('add-recs/categories/:categoryId/groups/:groupId/subgroups'),
    getAddRecProducts: arteliApi.Get<
      AddRecProduct[],
      {
        categoryId: Category['id']
        groupId: Group['id']
        subgroupId: Subgroup['id']
        storeIds: Store['id'][]
        subcategoryIds: Subcategory['id'][]
        productId?: Product['id']
      }
    >('add-recs/categories/:categoryId/groups/:groupId/subgroups/:subgroupId/products'),
    getActiveSet: arteliApi.Get<RecommendationSet>('rec-sets/active'),
    getRecStores: arteliApi.Get<
      RecStore[],
      PaginatedRequest<{
        ids?: RecStore['id'][]
        storeIds?: Store['id'][]
        actionType: ActionType
        productIds?: Product['id'][]
        flags?: RecStoreFlags
      }>
    >('rec-stores/:actionType'),
    getRecGroups: arteliApi.Get<
      RecGroup[],
      {
        actionType: ActionType
        categoryId: Category['id']
        storeIds: Store['id'][]
        subcategoryIds: Subcategory['id'][]
        groupIds?: Group['id'][]
        includeRecentlyAddedGroups?: boolean
      }
    >('rec-groups/:actionType/categories/:categoryId/groups')
  },
  Rejections: {
    findAll: arteliApi.Get<
      Rejection[],
      PaginatedRequest<{
        ids?: Rejection['id'][]
        groupIds?: Group['id'][]
        storeIds?: Store['id'][]
        onlyActive?: boolean
        actionSetIds?: ActionSet['id'][]
        categoryId?: Category['id']
        subcategoryId?: Subcategory['id']
      }>
    >('rejections'),
    create: arteliApi.Post<Rejection, RejectionCreate>('rejections'),
    destroy: arteliApi.Delete<null, { ids: Rejection['id'][] }>('rejections'),
    findOne: arteliApi.Get<Rejection, { id: Rejection['id'] }>('rejections/:id')
  },
  Categories: {
    findAll: arteliApi.Get<Category[], PaginatedRequest<{ ids?: Category['id'][]; includeInactive?: boolean }>>(
      'categories'
    ),
    findOne: arteliApi.Get<Category, { id: Category['id'] }>('categories/:id'),
    update: arteliApi.Put<Category, CategoryUpdate, { id: Category['id'] }>('categories/:id')
  },
  Groups: {
    findAll: arteliApi.Get<
      Group[],
      PaginatedRequest<{ ids?: Group['id'][]; includeInactive?: boolean; search?: string }>
    >('groups'),
    findOne: arteliApi.Get<Group, { id: Group['id'] }>('groups/:id')
  },
  Stores: {
    findAll: arteliApi.Get<Store[], PaginatedRequest<{ ids?: Store['id'][]; includeInactive?: boolean }>>('stores')
  },
  Subcategories: {
    findAll: arteliApi.Get<Subcategory[], PaginatedRequest<{ ids?: Subcategory['id'][]; includeInactive?: boolean }>>(
      'subcategories'
    ),
    findOne: arteliApi.Get<Subcategory, { id: Subgroup['id'] }>('subcategories/:id')
  },
  Subgroups: {
    findAll: arteliApi.Get<Subgroup[], PaginatedRequest<{ includeInactive?: boolean; ids?: Subcategory['id'][] }>>(
      'subgroups'
    ),
    findOne: arteliApi.Get<Subgroup, { id: Subgroup['id'] }>('subgroups/:id')
  },
  Users: {
    findAll: arteliApi.Get<TenantUser[], PaginatedRequest<{ ids?: TenantUser['id'][] }>>('tenant-users'),
    findOne: arteliApi.Get<TenantUser, { id: Subgroup['id'] }>('tenant-users/:id')
  },
  ClientRanks: {
    findAll: arteliApi.Get<ClientRank[], { id: Category['id']; ids?: Subgroup['id'][] }>('client-ranks/:id')
  },
  TenantSettings: {
    get: arteliApi.Get<TenantSettingsWithUiConfig>('tenant-settings'),
    update: arteliApi.Put<TenantSettingsWithUiConfig, TenantSettingsUpdateWithUiConfig>('tenant-settings')
  },
  UserJob: {
    findAll: arteliApi.Get<UserJob[], PaginatedRequest<{ ids?: UserJob['id'][] }>>('user-jobs'),
    getContent: arteliApi.Get<string, { id: UserJob['id'] }>('user-jobs/:id/content'),
    findOne: arteliApi.Get<UserJob, { id: UserJob['id'] }>('user-jobs/:id'),
    create: arteliApi.Post<UserJob, FormData, { type: UserJob['type'] }>('user-jobs/:type')
  },
  RecNotes: {
    find: arteliApi.Get<
      RecNote[],
      PaginatedRequest<{
        ids?: RecNote['id'][]
        groupIds?: Group['id'][]
        categoryId: Category['id']
        subcategoryIds: Subcategory['id'][]
        storeIds: Store['id'][]
      }>
    >('rec-notes'),
    create: arteliApi.Post<RecNote, RecNoteCreate>('rec-notes'),
    update: arteliApi.Put<RecNote, RecNoteUpdate, { id: RecNote['id'] }>('rec-notes/:id'),
    remove: arteliApi.Delete<null, { id: RecNote['id'] }>('rec-notes/:id')
  },
  Tags: {
    getAll: arteliApi.Get<ProductTag[]>('products/tags')
  },
  Demo: {
    reset: arteliApi.Post<null, null>('demo/reset')
  }
}

export type PaginatedRequest<T extends object = object> =
  | ({
      limit?: number
      offset?: number
      sortKeys?: string[]
    } & T)
  | undefined
