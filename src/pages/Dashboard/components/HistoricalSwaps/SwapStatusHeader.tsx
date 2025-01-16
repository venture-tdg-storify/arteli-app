import type { ActionCompletionStatus } from '@/api/types.generated'
import type { GridColumnHeaderParams, GridValidRowModel } from '@mui/x-data-grid-pro'
import { useContext, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { GridFilter } from '../../../../components/grid/GridFilter'
import { GridContext } from './GridContext'

export const SwapStatusHeader = <T extends GridValidRowModel>({
  colDef: { headerName }
}: GridColumnHeaderParams<T>) => {
  const { selectedActionCompletionStatuses, setSelectedActionCompletionStatuses, actionCompletionStatuses } =
    useContext(GridContext)

  useEffect(() => {
    setSelectedActionCompletionStatuses(actionCompletionStatuses)
  }, [actionCompletionStatuses, setSelectedActionCompletionStatuses])

  return (
    <div style={{ width: '100%', whiteSpace: 'normal' }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Typography
          component="span"
          sx={{ float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14, fontWeight: 500 }}
        >
          {headerName}
        </Typography>
        <GridFilter<ActionCompletionStatus>
          options={actionCompletionStatuses}
          value={selectedActionCompletionStatuses}
          onChange={setSelectedActionCompletionStatuses}
        />
      </Stack>
    </div>
  )
}
