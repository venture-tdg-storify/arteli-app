import type { TenantSettingsPowerBiReport } from '@/api/types.generated'
import React, { useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { ReportForm } from './ReportForm'

export function Report({
  report,
  onUpdate,
  onRemove,
  shouldDisable
}: {
  report: TenantSettingsPowerBiReport & { id: string }
  onUpdate: (values: TenantSettingsPowerBiReport & { id: string }) => void
  onRemove: (reportId: string) => void
  shouldDisable: boolean
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClickAway = () => {
    if (anchorEl) {
      setAnchorEl(null)
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <ListItem
          key={report.id}
          alignItems="flex-start"
          sx={{ border: '1px solid #FFEEBD', borderRadius: 4, width: 'fit-content', mb: 1 }}
          secondaryAction={
            <IconButton edge="end" aria-label="edit" onClick={handleClick} disabled={shouldDisable}>
              <Icon className="fa-ellipsis-vertical" sx={{ fontSize: 20 }} />
            </IconButton>
          }
        >
          <ListItemText primary={report.name} />
        </ListItem>
        <Popper id={id} open={open} anchorEl={anchorEl} placement="top-start">
          <Paper sx={{ padding: 2 }}>
            <ReportForm onRemove={onRemove} onUpdate={onUpdate} report={report} disabled={shouldDisable} />
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  )
}
