import type { Row } from '../../useRows'
import type { DataGridProProps, GridColDef } from '@mui/x-data-grid-pro'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { defineMessages, useIntl } from 'react-intl'
import { ColumnHeaderWithDescription } from '@/components/grid/ColumnHeaderWithDescription'
import { CurrencyColumn } from '@/components/grid/CurrencyColumn'
import TagsColumn from '@/components/TagsColumn'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import { ActionsColumn } from './ActionsColumn'
import { NameColumn } from './NameColumn'
import { ProgressColumn } from './ProgressColumn'

dayjs.extend(minMax)

const messages = defineMessages({
  pastSalesAll: { defaultMessage: 'Past Sales (All)', id: 'MtHZgr' },
  recommendationAvg: { defaultMessage: 'Recommendation Avg', id: 'DniJlx' },
  recommendationStores: { defaultMessage: 'Recommendation Stores', id: 'kW6ojg' },
  confidence: { defaultMessage: 'Confidence', id: 'EoQTj0' },
  storesHint: { defaultMessage: 'Arteli recommended stores', id: 'UKvW/m' },
  pastSalesAllHint: { defaultMessage: 'Gross sales across all stores over the past 90 days', id: 'ZNgUdC' },
  pastSalesStoreHint: { defaultMessage: 'Gross sales in recommended store(s) over the past 90 days', id: 'mP526Q' },
  predictedSalesStoreHint: {
    defaultMessage: 'Predicted sales in recommended store(s) over the next 90 days',
    id: 'tgnLz8'
  },
  recAvgHint: {
    defaultMessage: 'The average predicted sales per store from Arteli recommendations',
    id: '+BDfvp'
  }
})

export const useGridConfiguration = () => {
  const { headers } = useCommonLabels()
  const { formatMessage: t } = useIntl()

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        headerName: headers.Id,
        valueGetter: (_, { product }) => product?.externalId,
        field: 'product.externalId',
        sortable: false
      },
      {
        field: 'product.tags',
        headerName: headers.Tags,
        valueGetter: (_, { product }) => product?.tags,
        renderCell: TagsColumn,
        sortable: false
      },
      {
        headerName: headers.Subcategory,
        field: 'subcategory.externalId',
        valueGetter: (_, { subcategory }) => subcategory?.externalId,
        sortable: false
      },
      {
        field: 'recommendedStoresCnt',
        headerName: t(messages.recommendationStores),
        renderHeader: ColumnHeaderWithDescription,
        valueGetter: (_, { rec }) => rec?.storeIdsOverFilteredAddableStores?.length,
        description: t(messages.storesHint),
        sortable: false
      },
      {
        field: 'recommendationAvg',
        headerName: t(messages.recommendationAvg),
        renderCell: CurrencyColumn,
        valueGetter: (_, { rec }) => {
          const storeIdsOverFilteredAddableStores = rec?.storeIdsOverFilteredAddableStores

          if (!storeIdsOverFilteredAddableStores?.length) return null

          return (rec?.predictedSalesSumOverFilteredAddableStores ?? 0) / storeIdsOverFilteredAddableStores?.length
        },
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.recAvgHint),
        sortable: false
      },
      {
        field: 'existingStoresCnt',
        headerName: t(messages.confidence),
        renderCell: ProgressColumn,
        sortable: false
      },
      {
        field: 'pastSalesSumOverAllStores',
        headerName: t(messages.pastSalesAll),
        renderCell: CurrencyColumn,
        valueGetter: (_, { rec }) => rec?.pastSalesSumOverAllStores,
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.pastSalesAllHint),
        sortable: false
      },
      {
        field: 'pastSalesSumOverFilteredAddableStores',
        headerName: headers.PastSalesStore,
        renderCell: CurrencyColumn,
        valueGetter: (_, { rec }) => rec?.pastSalesSumOverFilteredAddableStores,
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.pastSalesStoreHint),
        sortable: false
      },
      {
        field: 'predictedSalesSumOverFilteredAddableStores',
        headerName: headers.PredictedSales90Days,
        renderCell: CurrencyColumn,
        valueGetter: (_, { rec }) => rec?.predictedSalesSumOverFilteredAddableStores,
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.predictedSalesStoreHint),
        sortable: false
      },
      {
        headerName: '',
        field: 'actionStore.id',
        renderCell: ActionsColumn,
        sortable: false,
        minWidth: 120,
        maxWidth: 130
      }
    ],
    [headers.Id, headers.PastSalesStore, headers.PredictedSales90Days, headers.Subcategory, headers.Tags, t]
  )

  const groupingColDef: DataGridProProps['groupingColDef'] = useMemo(
    () => ({
      headerName: headers.RecommendedProduct,
      flex: 1,
      renderCell: NameColumn
    }),
    [headers.RecommendedProduct]
  )

  return { columns, groupingColDef }
}
