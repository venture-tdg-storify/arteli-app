import type { Store, Group } from '@/api/arteli'
import type { Row } from '@/components/ProductsSelection/useRows'
import { useEffect, useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import api from '@/api'
import { useProductsByIdsQuery } from '@/hooks/arteli'
import { unique } from '@/utils'
import { allItemsQuery } from '@/utils/allItemsQuery'

const allRecStoresQuery = allItemsQuery(api.Arteli.Recs.getRecStores)

export const useRows = ({ groupId, storeIds }: { groupId: Group['id']; storeIds: Store['id'][] }) => {
  const [rows, setRows] = useState<Row[]>([])

  const { data: allRecStores, isFetching: isFetchingRecStores } = allRecStoresQuery({
    params: {
      actionType: 'Add',
      storeIds: storeIds
      // groupIds: [groupId]
    }
  })

  const recStores = useMemo(
    () => (allRecStores ?? []).filter((recStore) => recStore.groupId === groupId),
    [allRecStores, groupId]
  )

  const productIds = useMemo(() => unique((recStores ?? []).map((_) => _.productId)), [recStores])

  const { data: products, isFetching: isFetchingProduct } = useProductsByIdsQuery({
    params: { ids: productIds, includeInactive: true },
    enabled: Boolean(productIds.length)
  })

  const isFetching = isFetchingRecStores || isFetchingProduct

  useEffect(() => {
    if (isFetching || !recStores || !products) {
      return
    }

    const productsById = groupById(products)

    const rows = recStores.map(({ productId, predictedSales, pastSales, id: recStoreId }) => {
      const product = productsById[productId]

      if (!product) {
        console.error(`Product[${productId}] not found for RecStore[${recStoreId}]`)
      }

      return { product, predictedSales, pastSales }
    })

    setRows(rows.filter((_) => _.product !== undefined))
  }, [isFetching, products, recStores])

  return { rows, isFetching }
}
