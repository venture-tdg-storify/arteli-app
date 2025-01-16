import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import { useContext, useMemo, useState } from 'react'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import { GridContext } from './GridContext'

const messages = defineMessages({
  edit: { defaultMessage: 'Edit', id: 'wEQDC6' },
  delete: { defaultMessage: 'Delete Swap', id: 'rJlnuv' },
  editAddition: { defaultMessage: 'Edit Add Series', id: 'MVxTyh' },
  editRemoval: { defaultMessage: 'Edit Remove Series', id: 'WXPC1u' },
  editNamed: { defaultMessage: 'Edit {name}', id: 's3IOQQ' },
  editNote: { defaultMessage: 'Edit Swap Note', id: 'O0yFmY' },
  editProducts: { defaultMessage: 'Edit Products', id: 'c7r9Et' }
})

const Base = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%'
}))

export const ActionsMenu = ({
  onAdditionEdit,
  onDelete,
  onRemovalEdit,
  onNotesEdit,
  onProductsEdit,
  hasNote,
  translate = false,
  row
}: {
  onAdditionEdit: () => void
  onDelete: () => void
  onRemovalEdit: () => void
  onNotesEdit: () => void
  onProductsEdit: () => void
  hasNote: boolean
  translate?: boolean
  row?: ActionStoreRow
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { groupsById } = useContext(GridContext)

  const removalGroupName = useMemo(() => {
    const groupId = row?.dependantActionStore?.groupId

    return groupId ? groupsById[groupId]?.name : null
  }, [groupsById, row?.dependantActionStore?.groupId])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAdditionEdit = () => {
    onAdditionEdit()
    handleClose()
  }

  const handleRemovalEdit = () => {
    onRemovalEdit()
    handleClose()
  }

  const handleDelete = () => {
    onDelete()
    handleClose()
  }

  const handleNotesEdit = () => {
    onNotesEdit()
    handleClose()
  }

  const handleEditProducts = () => {
    onProductsEdit()
    handleClose()
  }

  return (
    <Base sx={{ transform: translate ? 'translateY(50%)' : 'default' }}>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        sx={{ borderRadius: 6 }}
        endIcon={<Icon className="fa-solid fa-caret-down" />}
        fullWidth
        onClick={handleClick}
      >
        <Badge
          variant="dot"
          invisible={!hasNote}
          badgeContent={1}
          color="warning"
          sx={{ '& .MuiBadge-dot': { top: '25%', right: '-15%' } }}
        >
          <FormattedMessage {...messages.edit} />
        </Badge>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ '.MuiMenu-list': { maxWidth: 210 } }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem onClick={handleAdditionEdit} disableRipple>
          <Typography
            color="primary"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            noWrap
            textOverflow="ellipsis"
          >
            <Icon className="fa-circle-plus" sx={{ mr: 1 }} />
            <FormattedMessage
              {...(row?.group.name ? messages.editNamed : messages.editAddition)}
              values={{ name: row?.group.name }}
            />
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleRemovalEdit} disableRipple>
          <Typography
            color="primary"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            noWrap
            textOverflow="ellipsis"
          >
            <Icon className="fa-circle-minus" sx={{ mr: 1 }} />
            <FormattedMessage
              {...(removalGroupName ? messages.editNamed : messages.editRemoval)}
              values={{ name: removalGroupName }}
            />
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleEditProducts} disableRipple>
          <Typography color="primary">
            <Icon className="fa-list" sx={{ mr: 1 }} />
            <FormattedMessage {...messages.editProducts} />
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNotesEdit} disableRipple>
          <Typography color="primary">
            <Badge
              variant="dot"
              invisible={!hasNote}
              badgeContent={4}
              color="warning"
              sx={{ '& .MuiBadge-dot': { top: '10%', right: '30%' } }}
            >
              <Icon className="fa-note" sx={{ mr: 1 }} />
            </Badge>
            <FormattedMessage {...messages.editNote} />
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleDelete} disableRipple>
          <Typography color="error">
            <Icon className="fa-trash" sx={{ mr: 1 }} />
            <FormattedMessage {...messages.delete} />
          </Typography>
        </MenuItem>
      </Menu>
    </Base>
  )
}
