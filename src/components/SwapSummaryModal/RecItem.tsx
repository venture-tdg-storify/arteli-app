import type { ProductFlags } from '@/api/arteli'
import Grid from '@mui/material/Grid2'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage, FormattedNumber } from 'react-intl'
import FlagIconGroup from '@/components/ProductFlagsList'
import Overline from '@/components/StoreOverline'
import { useTagList } from '@/hooks/useTagList'
import GroupIcon from '../GroupIcon'

export type RecItemData = {
  actionType?: 'Add' | 'Remove'
  name?: string
  pastSales?: number
  predictedSales?: number
  productFlags?: ProductFlags
  gutterBottom?: boolean
  active?: boolean
  onClick?: () => void
  groupId?: string
  tags?: number
}

const messages = defineMessages({
  series: { defaultMessage: 'Series', id: 'ORsvNl' },
  pastSales: { defaultMessage: 'Past Sales', id: 'i6dcrc' },
  predictedSales: { defaultMessage: 'Predicted Sales', id: 'erj0Av' },
  customTags: { defaultMessage: 'Custom Tags', id: 'Q5MFfG' }
})

export const RecItem = ({
  actionType,
  name,
  pastSales,
  predictedSales,
  gutterBottom = false,
  active = false,
  onClick,
  groupId,
  productFlags = 0,
  tags = 0
}: RecItemData) => {
  const { tagsList } = useTagList({ tags })
  return (
    <Grid
      container
      onClick={onClick}
      sx={({ palette, spacing }) => ({
        height: 72,
        border: `1px solid ${palette.divider}`,
        borderRadius: spacing(1),
        paddingLeft: spacing(2),
        backgroundColor: active ? '#DEEBFF' : '#FAFBFC',
        marginBottom: spacing(gutterBottom ? 2 : 0),
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        ':hover': { backgroundColor: onClick ? '#DEEBFF' : active ? '#DEEBFF' : '#FAFBFC' }
      })}
    >
      <Grid size={{ xs: 4 }}>
        <Stack direction="row" alignItems="center" spacing={4} justifyContent="start">
          {actionType && (
            <Icon
              className={actionType === 'Add' ? 'fa-circle-plus' : 'fa-circle-minus'}
              sx={(theme) => ({ fontSize: 18, mr: 1, color: theme.palette.text.tertiary })}
            />
          )}
          <Overline label={<FormattedMessage {...messages.series} />} spacing={2} direction="column">
            <Stack direction="row" spacing={1}>
              <Typography variant="body1">{name ?? 'N/A'}</Typography>
              <FlagIconGroup flags={productFlags ?? 0} />
              {groupId && <GroupIcon groupId={groupId} />}
            </Stack>
          </Overline>
        </Stack>
      </Grid>
      <Grid size={{ xs: 2 }}>
        <Overline label={<FormattedMessage {...messages.pastSales} />} spacing={2} direction="column">
          <Typography variant="body1" color="#27A571">
            <FormattedNumber value={pastSales ?? 0} style="currency" maximumFractionDigits={0} currency="USD" />
          </Typography>
        </Overline>
      </Grid>
      <Grid size={{ xs: 2 }}>
        <Overline label={<FormattedMessage {...messages.predictedSales} />} spacing={2} direction="column">
          <Typography variant="body1" color="#27A571">
            <FormattedNumber value={predictedSales ?? 0} style="currency" maximumFractionDigits={0} currency="USD" />
          </Typography>
        </Overline>
      </Grid>
      <Grid size={{ xs: 4 }}>
        <Overline label={<FormattedMessage {...messages.customTags} />} spacing={2} direction="column">
          <Typography variant="body2" color="#27A571" width="100%">
            {tags ? tagsList.join(', ') : 'N/A'}
          </Typography>
        </Overline>
      </Grid>
    </Grid>
  )
}
