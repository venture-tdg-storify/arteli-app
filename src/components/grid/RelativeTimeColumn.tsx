import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { FormattedRelativeTime } from 'react-intl'
import { formatTimeAgo } from '@/utils/formatTimeAgo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RelativeTimeColumn = ({ value: date }: GridRenderCellParams<any, string>) => {
  if (!date) return null

  return <FormattedRelativeTime {...formatTimeAgo(date)} numeric="auto" updateIntervalInSeconds={0} style="long" />
}
