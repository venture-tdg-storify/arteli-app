import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '@/utils/messages'

export const useCommonLabels = () => {
  const { formatMessage: t } = useIntl()

  const headers = useMemo(
    () => ({
      Action: t(commonMessages.action),
      Id: t(commonMessages.id),
      SeriesId: t(commonMessages.seriesId),
      SubseriesId: t(commonMessages.subseriesId),
      Category: t(commonMessages.category),
      Subcategory: t(commonMessages.subcategory),
      StoreCount: t(commonMessages.storeCount),
      PastSalesStore: t(commonMessages.pastSalesStore),
      PredictedSales90Days: t(commonMessages.predictedSalesStore),
      ProductName: t(commonMessages.productName),
      Name: t(commonMessages.name),
      RecommendedProduct: t(commonMessages.recommendation),
      ExistingStores: t(commonMessages.existing),
      AddStoreCount: t(commonMessages.addStoreCount),
      PastSales90DaysAllStores: t(commonMessages.pastSalesAll),
      PredictedSalesSeries: t(commonMessages.predictedSalesSeries),
      SwapStatus: t(commonMessages.swapStatus),
      Store: t(commonMessages.store),
      Stores: t(commonMessages.stores),
      Series: t(commonMessages.seriesName),
      ExecutionDate: t(commonMessages.executionDate),
      Status: t(commonMessages.status),
      Rank: t(commonMessages.rank),
      AvgMonthlyPastSales: t(commonMessages.avgMonthlyPastSales),
      AvgMonthlyPredictedSales: t(commonMessages.avgMonthlyPredictedSales),
      CurrentRank: t(commonMessages.currentRank),
      Notes: t(commonMessages.notes),
      Tags: t(commonMessages.tags)
    }),
    [t]
  )

  return { headers }
}
