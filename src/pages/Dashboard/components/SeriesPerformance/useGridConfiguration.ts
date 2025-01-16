import type { ActionStorePerf } from '@/api/types.generated'
import type { GridColDef } from '@mui/x-data-grid-pro'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { defineMessages, useIntl } from 'react-intl'
import { ColumnHeaderWithDescription } from '@/components/grid/ColumnHeaderWithDescription'
import { CurrencyColumn } from '@/components/grid/CurrencyColumn'
import { DateColumn } from '@/components/grid/DateColumn'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import { SwapOriginHeader } from './components/SwapOriginHeader'
import { labels } from './labels'

dayjs.extend(minMax)

const messages = defineMessages({
  grossSalesAddedForSeriesDescription: {
    defaultMessage: 'Gross sales of series while it was on the floor',
    id: 'QjbVZa'
  },
  arteliPredictedSalesDescription: {
    defaultMessage: 'Predicted gross sales of series while it was on the floor',
    id: 'TjqT1A'
  },
  netSalesForSeriesDescription: { defaultMessage: 'Net sales of series while it was on the floor', id: 'v6Uz+K' },
  predictedRemovalSalesDescription: {
    defaultMessage: 'Predicted gross sales of removal series during the time the added series was on the floor',
    id: 'KyGhhJ'
  }
})

export const useGridConfiguration = () => {
  const { headers } = useCommonLabels()
  const { formatMessage: t } = useIntl()

  const columns = useMemo<GridColDef<ActionStorePerf>[]>(
    () => [
      {
        headerName: t(labels.storeId),
        field: 'storeExternalId',
        sortable: false,
        flex: 1
      },
      {
        headerName: headers.Category,
        field: 'addedCategoryName',
        sortable: false,
        flex: 1
      },
      {
        headerName: t(labels.seriesAdded),
        field: 'addedGroupName',
        sortable: false,
        flex: 1
      },
      {
        headerName: t(labels.dateAddedToFloor),
        field: 'addedDate',
        renderCell: DateColumn,
        sortable: false,
        flex: 1
      },
      // {
      //   headerName: t(labels.dateRemovedFromFloor),
      //   field: 'removedDate',
      //   renderCell: DateColumn,
      //   sortable: false,
      //   flex: 1
      // },
      {
        headerName: t(labels.grossSalesAddedForSeries),
        field: 'salesSum',
        renderCell: CurrencyColumn,
        sortable: false,
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.grossSalesAddedForSeriesDescription),
        flex: 1
      },
      {
        headerName: t(labels.arteliPredictedSales),
        field: 'addedPredictedSales',
        renderCell: CurrencyColumn,
        sortable: false,
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.arteliPredictedSalesDescription),
        flex: 1
      },
      // {
      //   headerName: t(labels.netSalesForSeries),
      //   field: 'removedPredictedSales',
      //   renderCell: CurrencyColumn,
      //   sortable: false,
      //   renderHeader: ColumnHeaderWithDescription,
      //   description: t(messages.netSalesForSeriesDescription),
      //   flex: 1
      // },
      {
        headerName: t(labels.seriesRemoved),
        field: 'removedGroupName',
        sortable: false,
        flex: 1
      },
      {
        headerName: t(labels.predictedRemovalSales),
        field: 'removedPredictedSales',
        renderCell: CurrencyColumn,
        sortable: false,
        renderHeader: ColumnHeaderWithDescription,
        description: t(messages.predictedRemovalSalesDescription),
        flex: 1
      },
      {
        headerName: t(labels.swapOrigin),
        field: 'isManual',
        valueGetter: (_, row: ActionStorePerf) => t(row?.isManual ? labels.manual : labels.arteli),
        renderHeader: SwapOriginHeader,
        sortable: false,
        flex: 1
      }
    ],
    [headers.Category, t]
  )

  return { columns, headers }
}
