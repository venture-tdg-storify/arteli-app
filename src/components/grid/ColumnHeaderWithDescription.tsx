import type { GridColumnHeaderParams, GridValidRowModel } from '@mui/x-data-grid-pro'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

export function ColumnHeaderWithDescription<T extends GridValidRowModel>(params: GridColumnHeaderParams<T>) {
  const { colDef } = params

  return (
    <div style={{ width: '100%', whiteSpace: 'normal' }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Typography
          component="span"
          sx={{ float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14, fontWeight: 500 }}
        >
          {colDef.headerName}
        </Typography>
        {colDef.description && (
          <Tooltip title={colDef.description} sx={{ cursor: 'pointer' }}>
            <Icon className="fa-circle-info" />
          </Tooltip>
        )}
      </Stack>
    </div>
  )
}
