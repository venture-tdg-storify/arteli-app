import type { CategoryPerfRow } from './useRows'
import type { GridColDef } from '@mui/x-data-grid-pro'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { defineMessages, useIntl } from 'react-intl'
import { ColumnHeaderWithDescription } from '@/components/grid/ColumnHeaderWithDescription'
import { CurrencyColumn } from '@/components/grid/CurrencyColumn'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import { labels } from './labels'

dayjs.extend(minMax)

const messages = defineMessages({
  existingSeriesHint: { defaultMessage: 'Floored Series not attributed to a recommendation', id: 'HPLT+b' },
  newSeriesHint: { defaultMessage: 'New Series first sold in the past 6 months', id: 'rllF+u' },
  arteliHint: { defaultMessage: 'Floored Series due to recommendation', id: '+3Xuj7' }
})

export const useGridConfiguration = () => {
  const { headers } = useCommonLabels()
  const { formatMessage: t } = useIntl()

  const columns = useMemo<GridColDef<CategoryPerfRow>[]>(
    () => [
      {
        headerName: headers.Category,
        field: 'categoryName',
        sortable: false,
        flex: 1,
        headerClassName: 'performance-header'
      },
      {
        headerName: t(labels.arteli),
        field: 'arteliAvgPerStore',
        sortable: false,
        width: 120,
        renderCell: CurrencyColumn,
        description: t(messages.arteliHint),
        renderHeader: ColumnHeaderWithDescription,
        headerClassName: 'performance-header'
      },
      {
        headerName: t(labels.existingSeries),
        field: 'manualAvgPerStore',
        sortable: false,
        width: 160,
        renderCell: CurrencyColumn,
        description: t(messages.existingSeriesHint),
        renderHeader: ColumnHeaderWithDescription,
        headerClassName: 'performance-header'
      },
      {
        headerName: t(labels.newSeries),
        field: 'newGroupAvgPerStore',
        sortable: false,
        width: 140,
        renderCell: CurrencyColumn,
        description: t(messages.newSeriesHint),
        renderHeader: ColumnHeaderWithDescription,
        headerClassName: 'performance-header'
      }
    ],
    [headers.Category, t]
  )

  return { columns, headers }
}
