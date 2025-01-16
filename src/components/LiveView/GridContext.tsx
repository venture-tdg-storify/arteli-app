import type { Category, Group, RecStore, Subgroup } from '@/api/types.generated'
import { createContext } from 'react'

type OperatorType = {
  groupIds?: string[]
  productCategories: string[]
  productSubcategories: string[]
  pastSales: number[]
  predictedSales: number[]
  daysOnFloor: number[]
  clearance: RecStore[]
}

export type GridContextParams = {
  groupsById: Record<Group['id'], Group>
  subgroupsById: Record<Subgroup['id'], Subgroup>

  stats: Record<Group['id'], OperatorType>
  sub: Record<Subgroup['id'], OperatorType>
  comp: Record<Subgroup['id'], OperatorType>
  kit: Record<Subgroup['id'], OperatorType>

  categoryExternalIds: Category['externalId'][]
  setCategoryExternalIds: (categoryExternalIds: Category['externalId'][]) => void
  selectedCategoryExternalIds: Category['externalId'][]
  setSelectedCategoryExternalIds: (categoryExternalIds: Category['externalId'][]) => void
}

export const GridContext = createContext<GridContextParams>({} as GridContextParams)
