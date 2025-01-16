import Chip from '@mui/material/Chip'
import { useIntl } from 'react-intl'
import { ProductFlags } from '@/api/arteli'
import { productFlagsBackgroundColors, productFlagsMessages } from '@/utils/productFlags'

export function FlagChip({ flag = ProductFlags.None, rightMargin = false }) {
  const { formatMessage: t } = useIntl()

  return (
    <Chip
      label={t(productFlagsMessages[flag])}
      size="small"
      sx={{
        backgroundColor: productFlagsBackgroundColors[flag],
        fontWeight: 'regular',
        color: '#060e17',
        mr: rightMargin ? 1 : 0,
        border: 'none'
      }}
    />
  )
}
