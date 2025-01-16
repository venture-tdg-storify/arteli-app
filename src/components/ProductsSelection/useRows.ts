import type { Category, Subcategory, Store, Group, Product } from '@/api/arteli'
import { useEffect, useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import api from '@/api'
import { useProductsByIdsQuery } from '@/hooks/arteli'
import { useAddRecProductsBySubgroupIds } from '@/hooks/useAddRecProductIds'
import { unique } from '@/utils'

const useAddRecsSubgroups = api.Arteli.Recs.getAddRecSubgroups.asQuery()

export type Row = {
  product: Product
  predictedSales: number | null
  pastSales: number | null
}

export const useRows = ({
  groupId,
  categoryId,
  storeIds,
  subcategoryIds
}: {
  groupId: Group['id']
  categoryId: Category['id']
  storeIds: Store['id'][]
  subcategoryIds: Subcategory['id'][]
}) => {
  const [rows, setRows] = useState<Row[]>([])

  const params = { storeIds, categoryId, subcategoryIds }

  const { data: addRecSubgroups, isFetching: isFetchingAddRecSubgroups } = useAddRecsSubgroups({
    params: { ...params, groupId }
  })

  const { data: addRecProducts, isFetching: isFetchingAddRecProductIds } = useAddRecProductsBySubgroupIds({
    ...params,
    groupId,
    subgroupIds: (addRecSubgroups ?? []).map(({ subgroupId }) => subgroupId)
  })

  const productIds = useMemo(() => unique(addRecProducts.map((_) => _.productId)), [addRecProducts])

  const { data: products, isFetching: isFetchingProduct } = useProductsByIdsQuery({
    params: { ids: productIds, includeInactive: true },
    enabled: Boolean(productIds.length)
  })

  const isFetching = isFetchingAddRecSubgroups || isFetchingAddRecProductIds || isFetchingProduct

  useEffect(() => {
    if (isFetching || !addRecProducts || !products) {
      return
    }

    const productsById = groupById(products)

    setRows(
      addRecProducts.map((addRecProduct) => ({
        product: productsById[addRecProduct.productId],
        predictedSales: addRecProduct.predictedSalesSumOverFilteredAddableStores,
        pastSales: addRecProduct.pastSalesSumOverFilteredAddableStores
      }))
    )
  }, [addRecProducts, isFetching, products])

  return { rows, isFetching }
}
