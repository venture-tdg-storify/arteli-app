import type { GridContextParams } from './GridContext'
import type { Row } from './useRows'
import { useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import { RecStoreFlags, type Category, type Group, type Subgroup } from '@/api/types.generated'
import { unique } from '@/utils'

export const useGridContextValue = (rows: readonly Row[]): GridContextParams => {
  const [categoryExternalIds, setCategoryExternalIds] = useState<Category['externalId'][]>([])
  const [selectedCategoryExternalIds, setSelectedCategoryExternalIds] = useState<Category['externalId'][]>([])

  const { groupsById, subgroupsById, stats, sub, comp, kit } = useMemo(() => {
    const groups = unique(rows.map((_) => _.group))
    const subgroups = unique(rows.map((_) => _.subgroup))

    const groupsById = groupById<Group>(groups)
    const subgroupsById = groupById<Subgroup>(subgroups)

    const stats = rows.reduce(
      (acc, row) => {
        acc[row.group.id] = {
          groupIds: [...new Set([...(acc[row.group.id]?.groupIds ?? []), row.subgroup.externalId ?? ''])],
          productCategories: [...new Set([...(acc[row.group.id]?.productCategories ?? []), row.category.externalId])],
          productSubcategories: [
            ...new Set([...(acc[row.group.id]?.productSubcategories ?? []), row.subcategory.externalId])
          ],
          pastSales: [...(acc[row.group.id]?.pastSales ?? []), row.recStore.pastSales],
          predictedSales: [...(acc[row.group.id]?.predictedSales ?? []), row.recStore.predictedSales ?? 0],
          daysOnFloor: [...(acc[row.group.id]?.daysOnFloor ?? []), row.daysOnFloor].filter(Boolean),
          clearance: [
            ...(acc[row.group.id]?.clearance ?? []),
            ...(row.recStore.flags & RecStoreFlags.Clearance ? [row.recStore] : [])
          ]
        }

        return acc
      },
      {} as GridContextParams['stats']
    )
    const sub = rows.reduce(
      (acc, row) => {
        acc[row.subgroup.id] = {
          productCategories: [
            ...new Set([...(acc[row.subgroup.id]?.productCategories ?? []), row.category.externalId])
          ],
          productSubcategories: [
            ...new Set([...(acc[row.subgroup.id]?.productSubcategories ?? []), row.subcategory.externalId])
          ],
          pastSales: [...(acc[row.subgroup.id]?.pastSales ?? []), row.recStore.pastSales],
          predictedSales: [...(acc[row.subgroup.id]?.predictedSales ?? []), row.recStore.predictedSales ?? 0],
          daysOnFloor: [...(acc[row.subgroup.id]?.daysOnFloor ?? []), row.daysOnFloor].filter(Boolean),
          clearance: [
            ...(acc[row.subgroup.id]?.clearance ?? []),
            ...(row.recStore.flags & RecStoreFlags.Clearance ? [row.recStore] : [])
          ]
        }

        return acc
      },
      {} as GridContextParams['sub']
    )
    const comp = rows.reduce(
      (acc, row) => {
        acc[row.subgroup.id] = {
          productCategories: [
            ...new Set([...(acc[row.subgroup.id]?.productCategories ?? []), row.category.externalId])
          ],
          productSubcategories: [
            ...new Set([...(acc[row.subgroup.id]?.productSubcategories ?? []), row.subcategory.externalId])
          ],
          pastSales: [
            ...(acc[row.subgroup.id]?.pastSales ?? []),
            row.product.type === 'Component' ? row.recStore.pastSales : 0
          ],
          predictedSales: [
            ...(acc[row.subgroup.id]?.predictedSales ?? []),
            row.product.type === 'Component' ? (row.recStore.predictedSales ?? 0) : 0
          ],
          daysOnFloor: [
            ...(acc[row.subgroup.id]?.daysOnFloor ?? []),
            row.product.type === 'Component' ? row.daysOnFloor : 0
          ].filter(Boolean),
          clearance: [
            ...(acc[row.subgroup.id]?.clearance ?? []),
            ...(row.recStore.flags & RecStoreFlags.Clearance ? [row.recStore] : [])
          ]
        }

        return acc
      },
      {} as GridContextParams['comp']
    )

    const kit = rows.reduce(
      (acc, row) => {
        acc[row.subgroup.id] = {
          productCategories: [
            ...new Set([...(acc[row.subgroup.id]?.productCategories ?? []), row.category.externalId])
          ],
          productSubcategories: [
            ...new Set([...(acc[row.subgroup.id]?.productSubcategories ?? []), row.subcategory.externalId])
          ],
          pastSales: [
            ...(acc[row.subgroup.id]?.pastSales ?? []),
            row.product.type === 'Kit' ? row.recStore.pastSales : 0
          ],
          predictedSales: [
            ...(acc[row.subgroup.id]?.predictedSales ?? []),
            row.product.type === 'Kit' ? (row.recStore.predictedSales ?? 0) : 0
          ],
          daysOnFloor: [
            ...(acc[row.subgroup.id]?.daysOnFloor ?? []),
            row.product.type === 'Kit' ? row.daysOnFloor : 0
          ].filter(Boolean),
          clearance: [
            ...(acc[row.subgroup.id]?.clearance ?? []),
            ...(row.recStore.flags & RecStoreFlags.Clearance ? [row.recStore] : [])
          ]
        }

        return acc
      },
      {} as GridContextParams['kit']
    )
    return { groupsById, subgroupsById, stats, sub, comp, kit }
  }, [rows])

  const value = useMemo(
    () => ({
      groupsById,
      subgroupsById,
      stats,
      sub,
      comp,
      kit,
      categoryExternalIds,
      setCategoryExternalIds,
      setSelectedCategoryExternalIds,
      selectedCategoryExternalIds
    }),
    [groupsById, subgroupsById, stats, sub, comp, kit, categoryExternalIds, selectedCategoryExternalIds]
  )

  return value
}
