import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import React, { useCallback, useMemo, useState } from 'react'
import Divider from '@mui/material/Divider'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useMatch } from 'react-router-dom'
import { PATH_ACTIVE_ACTION_SET } from '@/routes'
import { usePresentation } from './usePresentation'

const messages = defineMessages({
  completed: { defaultMessage: 'Change Status to “Completed”', id: 'pI1Wdj' },
  overdue: { defaultMessage: 'Change Status to “Overdue”', id: 'r3rbKI' },
  inactive: { defaultMessage: 'Mark Series “Inactive”', id: 'Zdmmv+' },
  floorStatus: { defaultMessage: 'Change Floor Status ', id: 'lMiyQk' },
  clear: { defaultMessage: 'Reset changes', id: 'PysW/n' },
  clearAll: { defaultMessage: 'Reset all changes', id: 'LZEj35' }
})

export const PresentationMenu = ({ row, onClose }: { row: ActionStoreRow; onClose: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { items, setItem, resetItem, resetAll } = usePresentation()

  const isPlanPage = Boolean(useMatch(PATH_ACTIVE_ACTION_SET))

  const item = useMemo(() => items.find(({ id }) => id === row.actionStore.id), [items, row.actionStore.id])

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    },
    [anchorEl]
  )

  const handleClose = useCallback(() => {
    if (anchorEl) {
      setAnchorEl(null)
      onClose()
    }
  }, [anchorEl, onClose])

  const handleSetInactive = useCallback(() => {
    setItem({
      id: row.actionStore.id,
      status: 'Inactive Series',
      completionStatus: row.actionStore.completionStatus,
      overdueDate: row.overdueDate,
      completionDate: row.actionStore.completionDate
    })
    handleClose()
  }, [handleClose, row, setItem])

  const handleSetFloorStatus = useCallback(() => {
    setItem({
      id: row.actionStore.id,
      status: row.actionStore.actionType === 'Remove' ? 'No longer on floor' : 'Now on floor',
      completionStatus: row.actionStore.completionStatus,
      overdueDate: row.overdueDate,
      completionDate: row.actionStore.completionDate
    })
    handleClose()
  }, [handleClose, row, setItem])

  const handleSetCompleted = useCallback(() => {
    setItem({
      id: row.actionStore.id,
      status: row.actionStore.actionType === 'Remove' ? 'No longer on floor' : 'Now on floor',
      completionStatus: 'Completed',
      overdueDate: row.overdueDate,
      completionDate: dayjs().subtract(1, 'day').toISOString()
    })
    handleClose()
  }, [handleClose, row, setItem])

  const handleSetOverdue = useCallback(() => {
    setItem({
      id: row.actionStore.id,
      status: undefined,
      completionStatus: 'Overdue',
      overdueDate: dayjs().subtract(1, 'day').toISOString(),
      completionDate: null
    })
    handleClose()
  }, [handleClose, row.actionStore, setItem])

  const handleSetAuditInactive = useCallback(() => {
    setItem({
      id: row.actionStore.id,
      status: 'Inactive Series',
      completionStatus: 'Inactive',
      overdueDate: row.overdueDate,
      completionDate: null
    })
    handleClose()
  }, [handleClose, row, setItem])

  const handleClear = useCallback(() => {
    resetItem(row.actionStore.id)
    handleClose()
  }, [resetItem, row.actionStore.id, handleClose])

  const handleClearAll = useCallback(() => {
    resetAll()
    handleClose()
  }, [resetAll, handleClose])

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ ml: 0.5 }}>
        <Icon className="fa-ellipsis-vertical" />
      </IconButton>
      {Boolean(anchorEl) && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={true}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          {isPlanPage && (
            <MenuItem onClick={handleSetInactive} disabled={row.status === 'Inactive Series'}>
              <Typography variant="body2">
                <FormattedMessage {...messages.inactive} />
              </Typography>
            </MenuItem>
          )}
          {isPlanPage && (
            <MenuItem
              onClick={handleSetFloorStatus}
              disabled={row.status === 'No longer on floor' || row.status === 'Now on floor'}
            >
              <Typography variant="body2">
                <FormattedMessage {...messages.floorStatus} />
              </Typography>
            </MenuItem>
          )}
          {!isPlanPage && (
            <MenuItem onClick={handleSetCompleted} disabled={row.actionStore.completionStatus === 'Completed'}>
              <Typography variant="body2">
                <FormattedMessage {...messages.completed} />
              </Typography>
            </MenuItem>
          )}
          {!isPlanPage && (
            <MenuItem onClick={handleSetOverdue} disabled={row.actionStore.completionStatus === 'Overdue'}>
              <Typography variant="body2">
                <FormattedMessage {...messages.overdue} />
              </Typography>
            </MenuItem>
          )}
          {!isPlanPage && (
            <MenuItem onClick={handleSetAuditInactive} disabled={row.status === 'Inactive Series'}>
              <Typography variant="body2">
                <FormattedMessage {...messages.inactive} />
              </Typography>
            </MenuItem>
          )}
          {Boolean(items.length) && <Divider />}
          {item && (
            <MenuItem onClick={handleClear}>
              <Typography variant="body2">
                <FormattedMessage {...messages.clear} />
              </Typography>
            </MenuItem>
          )}
          {Boolean(items.length) && (
            <MenuItem onClick={handleClearAll}>
              <Typography variant="body2">
                <FormattedMessage {...messages.clearAll} />
              </Typography>
            </MenuItem>
          )}
        </Menu>
      )}
    </>
  )
}
