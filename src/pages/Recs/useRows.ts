import type { AddRecSubgroupRow } from './fetchSubgroupRows'
import type { ProductType, Group, Rejection, RecNote, Subgroup, Product, Subcategory, Store } from '@/api/arteli'
import { useEffect, useMemo, useState } from 'react'
import { groupByProperty } from '@arteli/utils'
import api from '@/api'
import { useAllRejections } from '@/hooks/arteli'
import { useFilteredAddRecs } from '@/hooks/useFilteredAddRecs'
import { useFilterFlags, useFilters } from '@/hooks/useFilters'
import { groupByHashMulti, groupByPropertyMulti } from '@/utils'
import { fetchAddRecProductRows, type AddRecProductRow } from './fetchAddRecProductRows'
import { fetchSubgroupRows } from './fetchSubgroupRows'

const useRecNotesQuery = api.Arteli.RecNotes.find.asQuery()

export type Rec = {
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
  productFlagsAny?: number
  productTagsAll?: number
  productTagsAny?: number
}

export enum RowType {
  Loading = 'loading',
  Group = 'group',
  Subgroup = 'subgroup',
  Product = 'product',
  Component = 'component',
  Kit = 'kit'
}

export type Row = {
  type: RowType
  path: string[]
  id: string
  rejections: Rejection[]
  notes?: RecNote
  group: Group
  subgroup?: Subgroup
  product?: Product
  subcategory?: Subcategory
  rec?: Rec
}

const initialData: Row[] = [] as Row[]

const hash = (str: string) => window.btoa(encodeURIComponent(str)).substring(0, 16)

export const useRows = ({ ids }: { ids: Group['id'][] | null }) => {
  const { categoryId, storeIds, subcategoryIds } = useFilters()
  const { allSubcategoriesSelected, filtersValid } = useFilterFlags()
  const subcategoryId = allSubcategoriesSelected ? undefined : subcategoryIds[0]

  const [subgroupRows, setSubgroupRows] = useState<Record<Group['id'], AddRecSubgroupRow[]>>({})
  const [productRows, setProductRows] = useState<Record<string, Record<Subgroup['id'], AddRecProductRow[]>>>({})

  const cacheKey = hash(`${categoryId}${storeIds.sort().join('')}${subcategoryIds.sort().join('')}`)

  useEffect(() => {
    setProductRows({})
    setSubgroupRows({})
  }, [cacheKey])

  const setSubgroupRowsByGroupId = (groupId: Group['id'], rows: AddRecSubgroupRow[]) => {
    setSubgroupRows((prev) => ({ ...prev, [groupId]: rows }))
  }

  const setProductRowsByGroupAndSubgroupId = (
    groupId: Group['id'],
    subgroupId: Subgroup['id'],
    rows: AddRecProductRow[]
  ) => {
    setProductRows((prev) => ({ ...prev, [groupId]: { ...prev[groupId], [subgroupId]: rows } }))
  }

  const loadSubgroupRowsByGroupId = (groupId: Group['id']) => {
    if (subgroupRows[groupId]) return

    fetchSubgroupRows({ storeIds, categoryId: categoryId!, subcategoryIds, groupId }).then((subgroupRows) => {
      setSubgroupRowsByGroupId(groupId, subgroupRows)
    })
  }

  const loadProductRows = (groupId: Group['id'], subgroupId: Subgroup['id']) => {
    if (productRows[groupId]?.[subgroupId]) return

    fetchAddRecProductRows({
      storeIds,
      categoryId: categoryId!,
      subcategoryIds,
      groupId,
      subgroupId
    }).then((productRows) => {
      setProductRowsByGroupAndSubgroupId(groupId, subgroupId, productRows)
    })
  }

  const params = useMemo(
    () => ({
      categoryId: categoryId!,
      storeIds,
      subcategoryIds,
      groupIds: ids ?? undefined
    }),
    [categoryId, ids, storeIds, subcategoryIds]
  )

  const { data: rejections } = useAllRejections({
    params: { onlyActive: true, storeIds, categoryId: categoryId!, subcategoryId },
    enabled: filtersValid
  })
  const { data: notes = [] } = useRecNotesQuery({ params, enabled: filtersValid })
  const { data: addRecs, isFetching } = useFilteredAddRecs({ params, enabled: filtersValid })

  const [rows, setRows] = useState<Row[]>(initialData)

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      if (ids?.length === 0 || !addRecs?.length) {
        return initialData
      }

      const rejectionsByGroupId = groupByPropertyMulti(rejections ?? [], 'groupId')
      const notesByGroupId = groupByProperty(notes, 'groupId')

      return addRecs
        .flatMap(({ addRecGroup, group }) => {
          const _ =
            (type: RowType) =>
            (...path: string[]) => ({
              type,
              path,
              id: [...path, cacheKey].join('-'),
              group,
              rejections: rejectionsByGroupId[group.id]
            })

          return [
            {
              ..._(RowType.Group)(group.id),
              notes: notesByGroupId[group.id],
              rec: {
                ...addRecGroup,
                storeIdsOverFilteredAddableStores: addRecGroup.filteredAddableStores.map(({ storeId }) => storeId)
              }
            },
            ...(subgroupRows[group.id]
              ? subgroupRows[group.id].flatMap(({ addRecSubgroup, subgroup }) => {
                  const subgroupProductRows = productRows[group.id]?.[subgroup.id]

                  const subgroupRow = {
                    ..._(RowType.Subgroup)(group.id, subgroup.id),
                    subgroup,
                    rec: {
                      ...addRecSubgroup,
                      storeIdsOverFilteredAddableStores: addRecSubgroup.filteredAddableStores.map(
                        ({ storeId }) => storeId
                      )
                    }
                  }

                  if (!subgroupProductRows) {
                    return [subgroupRow, { ..._(RowType.Loading)(group.id, subgroup.id, 'loading'), subgroup }]
                  }

                  const {
                    Kit: kitProductRows = [],
                    Component: componentProductRows = [],
                    Item: itemProductRows = []
                  } = groupByHashMulti(
                    subgroupProductRows.map(({ addRecProduct, product, subcategory }: AddRecProductRow) => {
                      const typePrefix = [product!.type].filter((_) => _ !== 'Item')

                      return {
                        ..._(RowType.Product)(group.id, subgroup.id, ...typePrefix, product!.id),
                        subcategory,
                        product,
                        rec: product!.type !== 'Kit' ? addRecProduct : undefined
                      }
                    }),
                    ({ product }) => product!.type
                  )

                  return [
                    subgroupRow,
                    ...itemProductRows,
                    ...(componentProductRows.length
                      ? [_(RowType.Component)(group.id, subgroup.id, 'Component' as ProductType)]
                      : []),
                    ...componentProductRows,
                    ...(kitProductRows.length ? [_(RowType.Kit)(group.id, subgroup.id, 'Kit' as ProductType)] : []),
                    ...kitProductRows
                  ]
                })
              : [_(RowType.Loading)(group.id, 'loading')])
          ]
        })
        .sort((a, b) => Number(Boolean(a.rejections?.length)) - Number(Boolean(b.rejections?.length)))
    })
  }, [addRecs, cacheKey, ids?.length, isFetching, notes, productRows, rejections, subgroupRows])

  return { isFetching, rows, loadSubgroupRowsByGroupId, subgroupRows, loadProductRows }
}
