import type { GridRenderCellParams, GridValidRowModel } from '@mui/x-data-grid-pro'
import { FormattedDate } from 'react-intl'

export const DateColumn = <T extends GridValidRowModel>({
  value: date
}: GridRenderCellParams<T, string | number | Date>) => {
  if (!date) return null

  return <FormattedDate value={date} />
}
