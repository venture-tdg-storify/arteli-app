import { useEffect, useState } from 'react'
import { type ActionType, RecStoreFlags, type RecStore, type Store } from '@/api/types.generated'
import { useAllRecommendationStores, useAllStores } from '@/hooks/arteli'
import { groupByPropertyMulti } from '@/utils'

export type StoreRow = {
  store: Store
  clearance: boolean
  actionType: ActionType
  pastSales?: number
  floorDate: string | null
}

const initialData: StoreRow[] = [] as StoreRow[]
const noRecStore: RecStore[] = [] as RecStore[]

export const useRecommendationStores = ({ productIds }: { productIds?: string[] }) => {
  const { data: stores, isFetching: isFetchingAllStores } = useAllStores()

  const { data: removeRecStores = noRecStore, isFetching: isFetchingRemoveRecStores } = useAllRecommendationStores({
    params: { actionType: 'Remove', productIds },
    enabled: Boolean(productIds?.length)
  })

  const { data: addRecStores = noRecStore, isFetching: isFetchingAddRecStores } = useAllRecommendationStores({
    params: { actionType: 'Add', productIds },
    enabled: Boolean(productIds?.length)
  })

  const [rows, setRows] = useState<StoreRow[]>(initialData)

  const isFetching = isFetchingRemoveRecStores || isFetchingAddRecStores || isFetchingAllStores

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      const recStores = [...addRecStores, ...removeRecStores]

      if (!recStores?.length || !stores?.length) {
        return initialData
      }

      const recommendationsStoresByStoreId = groupByPropertyMulti(recStores, 'storeId')

      return (stores ?? [])
        .sort((a, b) => (a.externalId || '').localeCompare(b.externalId || ''))
        .map((store) => {
          const recommendationStores = recommendationsStoresByStoreId[store.id]

          return {
            store,
            clearance: recommendationStores?.some(({ flags }) => flags & RecStoreFlags.Clearance),
            actionType: recommendationStores?.some(({ actionType }) => actionType === 'Remove') ? 'Remove' : 'Add',
            pastSales: recommendationStores?.reduce((sales, _) => sales + _.pastSales, 0),
            floorDate:
              recommendationStores
                ?.map((_) => _.floorDate)
                .filter(Boolean)
                .sort()[0] ?? null
          }
        })
    })
  }, [addRecStores, isFetching, removeRecStores, stores])

  return { isFetching, allStoresMap: rows }
}
