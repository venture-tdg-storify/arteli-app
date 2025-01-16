import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
// import { useGridApiContext } from '@mui/x-data-grid-pro'
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl'

const GrayedOut = styled('span')(({ theme }) => ({
  color: theme.palette.text.tertiary
}))

const messages = defineMessages({
  noSalesData: { defaultMessage: 'Item has no sales', id: 'fZ2y9R' }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CurrencyColumn = ({ value: amount }: GridRenderCellParams<any, number>) => {
  // const node: GridBasicGroupNode = rowNode as GridBasicGroupNode

  if (amount === null || amount === undefined) return null

  if (amount === 0)
    return (
      <Tooltip title={<FormattedMessage {...messages.noSalesData} />}>
        <GrayedOut>
          <FormattedNumber value={0} currency="USD" style="currency" maximumFractionDigits={0} />
        </GrayedOut>
      </Tooltip>
    )

  return <FormattedNumber value={amount} currency="USD" style="currency" maximumFractionDigits={0} />
}
