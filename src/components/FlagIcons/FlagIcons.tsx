import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useIntl } from 'react-intl'
import { ProductFlags } from '@/api/arteli'
import { productFlagsBackgroundColors, productFlagsIcons, productFlagsMessages } from '@/utils/productFlags'

const Badge = styled('div')(({ theme: { spacing } }) => ({
  width: spacing(3),
  minWidth: spacing(3),
  height: spacing(3),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const allowedFlags: ProductFlags[] = [ProductFlags.Exclusive, ProductFlags.New]

const allowedFlagsMask = allowedFlags.reduce((acc, flag) => acc | flag, ProductFlags.None)

export function FlagIcons({ flags }: { flags: number }) {
  const { formatMessage: t } = useIntl()

  if (!(flags & allowedFlagsMask)) return null

  return (
    <Stack direction="row" spacing={1} mr={1}>
      {allowedFlags
        .filter((_) => flags & _)
        .map((flag: ProductFlags) => (
          <Tooltip title={t(productFlagsMessages[flag])} key={flag}>
            <Badge sx={{ background: productFlagsBackgroundColors[flag] }}>
              <Icon
                className={productFlagsIcons[flag]}
                sx={{ color: 'black', fontSize: 11, height: 'auto', width: 'auto' }}
              />
            </Badge>
          </Tooltip>
        ))}
    </Stack>
  )
}
