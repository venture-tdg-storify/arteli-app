export type ActionSetTypesStatus = 'Started' | 'Finalized'

export type ActionSetFinalize = {
  name: string
  overdueDays: number
}

export type ActionSet = {
  id: Id<'id-arteli-core-data-entities-actionset'> | string
  createdById: TenantUser['id']
  updatedById: TenantUser['id']
  status: ActionSetTypesStatus
  name: string
  createdAt: string
  updatedAt: string
  finalizedAt: string | null
  finalizedById: TenantUser['id'] | null
  overdueDays: number | null
}

export type ActionSetUpdate = {
  name: string
}

export type ActionStoreCreate = {
  categoryId: Category['id']
  subcategoryId: Subcategory['id'] | null
  groupId: Group['id']
  storeId: Store['id']
  actionType: ActionType
  productIds: Product['id'][]
  flags?: number
  note?: string | null
  swap?: ActionStoreCreateSwapCreate | null
}

export type ActionStoreCreateSwapCreate = {
  categoryId: Category['id']
  subcategoryId: Subcategory['id'] | null
  groupId: Group['id']
  note?: string | null
}

export enum ActionStoreCreateFlags {
  None = 0,
  Manual = 1,
  Ai = 2
}

export type ActionStoreCreateMulti = {
  actions: ActionStoreCreate[]
}

export type ActionStorePerf = {
  storeId: Store['id']
  storeExternalId: string
  storeName: string
  addedActionStoreId: ActionStore['id']
  addedPredictedSales: number
  addedCategoryId: Category['id']
  addedCategoryName: string
  addedSubcategoryId: Subcategory['id']
  addedSubcategoryName: string
  addedGroupId: Group['id']
  addedGroupName: string
  removedActionStoreId: ActionStore['id'] | null
  removedPredictedSales: number | null
  removedCategoryId: Category['id'] | null
  removedCategoryName: string | null
  removedSubcategoryId: Subcategory['id'] | null
  removedSubcategoryName: string | null
  removedGroupId: Group['id'] | null
  removedGroupName: string | null
  salesSum: number
  daysOnFloor: number
  addedDate: string
  isManual: boolean
}

export type ActionStore = {
  id: Id<'id-arteli-core-data-entities-actionstore'> | string
  setId: ActionSet['id']
  createdById: TenantUser['id']
  createdAt: string
  updatedById: TenantUser['id']
  updatedAt: string
  actionType: ActionType
  categoryId: Category['id']
  subcategoryId: Subcategory['id'] | null
  groupId: Group['id']
  storeId: Store['id']
  pastSales: number
  predictedSales: number | null
  principalId: ActionStore['id'] | null
  dependentId: ActionStore['id'] | null
  completionStatus: ActionCompletionStatus
  completionDate: string | null
  note: string | null
  flags: number
  productIds: Product['id'][]
  productCount: number
  productFlagsAny: number
  productFlagsAll: number
  productTagsAny: number
  productTagsAll: number
}

export enum ActionStoreFlags {
  None = 0,
  Manual = 1,
  Ai = 2
}

export enum ActionStoreProductFlagsAll {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export enum ActionStoreProductFlagsAny {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export type AddRecGroup = {
  groupId: Group['id']
  subcategoryIds: Subcategory['id'][]
  pastSalesSumOverAllStores: number
  pastSalesSumOverFilteredStores: number
  pastSalesSumOverFilteredAddableStores: number
  predictedSalesSumOverAllStores: number
  predictedSalesSumOverFilteredStores: number
  predictedSalesSumOverFilteredAddableStores: number
  storeCountOverAlreadyOnFloor: number
  storeCountOverAdditionPending: number
  storeCountOverRemovalPending: number
  productFlagsAny: number
  productFlagsAll: number
  productTagsAny: number
  productTagsAll: number
  filteredAddableStores: RecStoreData[]
}

export enum AddRecGroupProductFlagsAll {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export enum AddRecGroupProductFlagsAny {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export type AddRecProduct = {
  groupId: Group['id']
  subgroupId: Subgroup['id']
  productId: Product['id']
  pastSalesSumOverAllStores: number
  pastSalesSumOverFilteredStores: number
  pastSalesSumOverFilteredAddableStores: number
  predictedSalesSumOverAllStores: number
  predictedSalesSumOverFilteredStores: number
  predictedSalesSumOverFilteredAddableStores: number
  storeCountOverAlreadyOnFloor: number
  storeCountOverAdditionPending: number
  storeCountOverRemovalPending: number
  storeIdsOverFilteredAddableStores: Store['id'][]
}

export type AddRecSubgroup = {
  groupId: Group['id']
  subgroupId: Subgroup['id']
  subcategoryIds: Subcategory['id'][]
  pastSalesSumOverAllStores: number
  pastSalesSumOverFilteredStores: number
  pastSalesSumOverFilteredAddableStores: number
  predictedSalesSumOverAllStores: number
  predictedSalesSumOverFilteredStores: number
  predictedSalesSumOverFilteredAddableStores: number
  storeCountOverAlreadyOnFloor: number
  storeCountOverAdditionPending: number
  storeCountOverRemovalPending: number
  productFlagsAny: number
  productFlagsAll: number
  productTagsAny: number
  productTagsAll: number
  filteredAddableStores: RecStoreData[]
}

export enum AddRecSubgroupProductFlagsAll {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export enum AddRecSubgroupProductFlagsAny {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export type ActionCompletionStatus = 'Pending' | 'Completed' | 'Expired' | 'Inactive' | 'Overdue'

export type ActionType = 'Add' | 'Remove'

export type ActiveState = 'Active' | 'Inactive'

export type ProductType = 'Item' | 'Component' | 'Kit'

export type CategoryPerf = {
  categoryName: string
  date: string
  arteliSales: number
  manualSales: number
  newGroupSales: number
  arteliStores: number
  manualStores: number
  newGroupStores: number
}

export type Category = {
  id: Id<'id-arteli-core-data-entities-category'> | string
  externalId: string
  name: string
  description: string | null
  isActive: boolean
  isInActiveRecSet: boolean
  operatingCost: number
}

export type CategoryUpdate = {
  operatingCost: number
}

export type ClientRank = {
  id: Id<'id-arteli-core-data-entities-clientrank'> | string
  categoryId: Category['id']
  subgroupId: Subgroup['id']
  rank: number
}

export type Group = {
  id: Id<'id-arteli-core-data-entities-group'> | string
  externalId: string
  name: string
  isActive: boolean
}

export type ProblemDetails = {
  type: string | null
  title: string | null
  status: number | null
  detail: string | null
  instance: string | null
}

export type Product = {
  id: Id<'id-arteli-core-data-entities-product'> | string
  externalId: string
  name: string
  type: ProductType
  description: string | null
  isActive: boolean
  categoryId: Category['id']
  subcategoryId: Subcategory['id']
  groupId: Group['id']
  subgroupId: Subgroup['id']
  imageUrls: string[] | null
  tags: number
  flags: number
}

export enum ProductFlags {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export type ProductTag = {
  id: Id<'id-arteli-core-data-entities-producttag'> | string
  name: string
  value: number
}

export type RecGroup = {
  actionType: ActionType
  storeId: Store['id']
  groupId: Group['id']
  categoryId: Category['id']
  subcategoryIds: Subcategory['id'][]
  lastAddedDate: string | null
  lastRemovedDate: string | null
  pastSales: number
  predictedSales: number
  groupActiveState: ActiveState
  productTagsAny: number
  productTagsAll: number
  productFlagsAny: number
  productFlagsAll: number
  recStoreFlagsAny: number
  recStoreFlagsAll: number
}

export enum RecGroupProductFlagsAll {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export enum RecGroupProductFlagsAny {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export enum RecGroupRecStoreFlagsAll {
  None = 0,
  Clearance = 1
}

export enum RecGroupRecStoreFlagsAny {
  None = 0,
  Clearance = 1
}

export type RecNoteCreate = {
  groupId: Group['id']
  content: string
  categoryId: Category['id']
  subcategoryIds: Subcategory['id'][]
  storeIds: Store['id'][]
}

export type RecNote = {
  id: Id<'id-arteli-core-data-entities-recnote'> | string
  tenantUserId: TenantUser['id']
  groupId: Group['id']
  createdAt: string
  updatedAt: string
  content: string
}

export type RecNoteUpdate = {
  content: string
}

export type RecSet = {
  id: Id<'id-arteli-core-data-entities-recset'> | string
  activeState: ActiveState
  createdAt: string
  predictionsTimestamp: string
}

export type RecStoreData = {
  storeId: Store['id']
  pastSales: number
  predictedSales: number
  lastRemovalDate: string | null
  recStoreFlagsAny: number
  recStoreFlagsAll: number
}

export enum RecStoreDataRecStoreFlagsAll {
  None = 0,
  Clearance = 1
}

export enum RecStoreDataRecStoreFlagsAny {
  None = 0,
  Clearance = 1
}

export type RecStore = {
  id: Id<'id-arteli-core-data-entities-recstore'> | string
  storeId: Store['id']
  productId: Product['id']
  groupId: Group['id']
  subgroupId: Subgroup['id']
  actionType: ActionType
  pastSales: number
  predictedSales: number | null
  floorDate: string | null
  productTags: number
  productFlags: number
  flags: number
}

export enum RecStoreFlags {
  None = 0,
  Clearance = 1
}

export enum RecStoreProductFlags {
  None = 0,
  Exclusive = 1,
  New = 2,
  OrphanedComponents = 32768
}

export type RejectionCreate = {
  categoryId: Category['id']
  subcategoryId: Subcategory['id'] | null
  groupId: Group['id']
  storeIds: Store['id'][]
  actionType: ActionType
  reason: RejectionReason
}

export type RejectionReason =
  | 'AestheticIssue'
  | 'Discontinued'
  | 'IncorrectFloorStatus'
  | 'InventoryIssue'
  | 'PlannedFutureDrop'
  | 'PreviouslyPerformedPoorly'
  | 'SpaceConstraints'
  | 'VisuallySimilarSeriesAlreadyOnFloor'
  | 'Other'

export type Rejection = {
  id: Id<'id-arteli-core-data-entities-rejection'> | string
  createdAt: string
  createdById: TenantUser['id']
  actionSetId: ActionSet['id']
  categoryId: Category['id']
  subcategoryId: Subcategory['id'] | null
  groupId: Group['id']
  storeId: Store['id']
  reason: RejectionReason
  actionType: ActionType
}

export type Store = {
  id: Id<'id-arteli-core-data-entities-store'> | string
  externalId: string
  name: string
  isActive: boolean
  userCanAccess: boolean | null
  regionName: string | null
}

export type Subcategory = {
  id: Id<'id-arteli-core-data-entities-subcategory'> | string
  externalId: string
  name: string
  isActive: boolean
  categoryIds: Category['id'][]
  isInActiveRecSet: boolean
}

export type Subgroup = {
  id: Id<'id-arteli-core-data-entities-subgroup'> | string
  externalId: string
  name: string
  isActive: boolean
}

export type TenantSettings = {
  actionOverdueDays: number
  recentlyAddedThresholdDays: number
  recentlyRemovedThresholdDays: number
  powerBiReports: TenantSettingsPowerBiReport[]
  uiConfig: object | null
}

export type TenantSettingsPowerBiReport = {
  name: string
  url: string
}

export type TenantSettingsUpdate = {
  actionOverdueDays: number
  powerBiReports: TenantSettingsPowerBiReport[]
  recentlyAddedThresholdDays: number
  recentlyRemovedThresholdDays: number
  uiConfig: object
}

export type TenantUser = {
  id: Id<'id-arteli-core-data-entities-tenantuser'> | string
  email: string
  name: string
}

export type UserJobTypesProcessingStatus = 'Pending' | 'Completed' | 'CompletedWithErrors' | 'Failed'

export type UserJobTypesType = 'ClientRankCsv' | 'ProductFlagsCsv' | 'SisterSubgroupsCsv' | 'RegionsCsv'

export type UserJob = {
  id: Id<'id-arteli-core-data-entities-userjob'> | string
  type: UserJobTypesType
  name: string
  processingStatus: UserJobTypesProcessingStatus
  processingStatusChangedAt: string | null
  createdById: TenantUser['id']
  createdAt: string
  errors?: UserJobErrorItem[]
}

export type UserJobErrorItem = {
  target: string
  error: string
}

export type Id<T extends string> = string & {
  readonly __brand: T
}
