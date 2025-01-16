import type { Row } from './useRows'
import type { GridColDef } from '@mui/x-data-grid-pro'
import { useMemo } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { CurrencyColumn } from '@/components/grid/CurrencyColumn'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import { commonMessages } from '@/utils/messages'

const messages = defineMessages({
  product: { defaultMessage: 'Product', id: 'x/ZVlU' },
  ID: { defaultMessage: 'ID', id: 'qlcuNQ' },
  pastSales: { defaultMessage: 'Past Sales', id: 'i6dcrc' }
})

export const useGridConfiguration = () => {
  const { headers } = useCommonLabels()
  const { formatMessage: t } = useIntl()

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        headerName: t(messages.product),
        field: 'productName',
        valueGetter: (_, row) => row.product.name,
        flex: 1
      },
      {
        headerName: t(messages.ID),
        field: 'productId',
        valueGetter: (_, row) => row.product.externalId,
        width: 130
      },
      {
        headerName: t(messages.pastSales),
        field: 'pastSales',
        width: 130,
        renderCell: CurrencyColumn
      },
      {
        headerName: t(commonMessages.predictedSales),
        field: 'predictedSales',
        width: 130,
        renderCell: CurrencyColumn
      }
    ],
    [t]
  )

  return { columns, headers }
}
