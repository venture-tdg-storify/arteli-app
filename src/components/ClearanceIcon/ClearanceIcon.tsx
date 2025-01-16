import type { BadgeProps } from '@mui/material/Badge'
import Badge from '@mui/material/Badge'
import Icon from '@mui/material/Icon'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  title: { defaultMessage: 'Series is on clearance in this store', id: 'WVWaHW' },
  countTitle: { defaultMessage: 'Series is on clearance at {count} store(s)', id: 'NorboU' },
  productTitle: { defaultMessage: 'Product is on clearance in this store', id: 'mhkOWd' },
  titleBoth: { defaultMessage: 'Series is both on clearance and on regular sale in this store', id: 'cTwa4C' },
  productBoth: { defaultMessage: 'Product is both on clearance and on regular sale in this store', id: 'YoHIRs' },
  countBothTitle: {
    defaultMessage: 'Series is both on clearance and on regular sale at {count} store(s)',
    id: 's3VsbU'
  },
  titleSwap: { defaultMessage: 'Series being added is on clearance in this store', id: 'fwgcMy' }
})

const StyledBadge = styled(Badge)<BadgeProps & { clearanceAndSale: boolean; count?: number }>(
  ({ theme, clearanceAndSale, count }) => ({
    '& .MuiBadge-badge': {
      color: theme.palette.info.contrastText,
      backgroundColor: clearanceAndSale ? (count ? theme.palette.text.secondary : 'unset') : theme.palette.warning.main,
      right: -4,
      top: 12
    }
  })
)

export const ClearanceIcon = ({
  count,
  clearanceAndSale = true,
  isProduct = false,
  isSwap = false
}: {
  count?: number
  clearanceAndSale?: boolean
  isProduct?: boolean
  isSwap?: boolean
}) => {
  const { formatMessage: t } = useIntl()
  const title = clearanceAndSale
    ? count
      ? messages.countBothTitle
      : isProduct
        ? messages.productBoth
        : messages.titleBoth
    : count
      ? messages.countTitle
      : isProduct
        ? messages.productTitle
        : isSwap
          ? messages.titleSwap
          : messages.title

  const badgeContent = count ? count : clearanceAndSale ? '$' : '!'

  return (
    <Tooltip title={t(title, { count })}>
      <StyledBadge
        badgeContent={badgeContent}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        clearanceAndSale={clearanceAndSale}
        count={count}
      >
        <Icon
          className={clearanceAndSale ? 'fa-tags' : 'fa-tag'}
          sx={(theme) => ({ fontSize: 20, transform: 'rotate(270deg)', color: theme.palette.text.secondary })}
        />
      </StyledBadge>
    </Tooltip>
  )
}
