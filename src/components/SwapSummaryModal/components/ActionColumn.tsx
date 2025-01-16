import type { Row } from '../useRows'
import type { Store } from '@/api/types.generated'
import type { GridBasicGroupNode, GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useCallback, useState } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import DeleteSeriesModal from '@/components/DeleteSeriesModal'
import { useSwap } from '../useSwap'
import { DeleteStoreModal } from './DeleteStoreModal'
import { EditSeriesModal } from './EditSeriesModal'
import { SwapNoteModal } from './SwapNoteModal'

const messages = defineMessages({
  edit: { defaultMessage: 'Edit', id: 'wEQDC6' },
  editSeries: { defaultMessage: 'Edit series', id: 'S97eEu' },
  deleteSeries: { defaultMessage: 'Delete Series', id: 'sH/2RD' },
  editSwapNotes: { defaultMessage: 'Edit Swap Note', id: 'O0yFmY' }
})

const Base = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(0, 2)
}))

export const ActionColumn = ({ rowNode, row }: GridRenderCellParams<Row>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [storeModal, setStoreModal] = useState(false)
  const [seriesModal, setSeriesModal] = useState(false)
  const [noteModal, setNoteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const { deleteStore, deleteSeries, setNote } = useSwap()

  const node: GridBasicGroupNode = rowNode as GridBasicGroupNode
  const storeId = node.type === 'group' ? (node.groupingKey as Store['id']) : row.store.id

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleConfirmDeleteStore = useCallback(() => {
    deleteStore(storeId)
    setStoreModal(false)
  }, [storeId, deleteStore])

  const handleConfirmDeleteSeries = useCallback(() => {
    const groupId = row.group?.id
    if (groupId) {
      deleteSeries(row.store.id, groupId)
      setSeriesModal(false)
    }
  }, [deleteSeries, row])

  const handleAddNote = useCallback(
    (text: string) => {
      setNote(storeId, text)
      setNoteModal(false)
    },
    [setNote, storeId]
  )

  if (node.type === 'group') {
    return (
      <Base>
        <Button
          size="small"
          variant="contained"
          sx={(theme) => ({ borderRadius: 48, minWidth: 40, padding: 1, backgroundColor: theme.palette.grey[600] })}
          onClickCapture={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setStoreModal(true)
          }}
        >
          <Icon
            className="fa-solid fa-ban"
            sx={(theme) => ({
              color: theme.palette.background.default
            })}
          />
        </Button>
        <DeleteStoreModal open={storeModal} onClose={() => setStoreModal(false)} onConfirm={handleConfirmDeleteStore} />
      </Base>
    )
  }

  return (
    <Base>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        sx={{ borderRadius: 6 }}
        endIcon={<Icon className="fa-solid fa-caret-down" />}
        fullWidth
        onClick={handleClick}
      >
        <FormattedMessage {...messages.edit} />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setEditModal(true)
            handleClose()
          }}
          disableRipple
        >
          <Typography color="primary">
            <FormattedMessage {...messages.editSeries} />
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSeriesModal(true)
            handleClose()
          }}
          disableRipple
          disabled={!row.group?.id}
        >
          <Typography color="primary">
            <FormattedMessage {...messages.deleteSeries} />
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setNoteModal(true)
            handleClose()
          }}
          disableRipple
        >
          <Typography color="primary">
            <FormattedMessage {...messages.editSwapNotes} />
          </Typography>
        </MenuItem>
      </Menu>
      <DeleteSeriesModal
        open={seriesModal}
        onClose={() => setSeriesModal(false)}
        onConfirm={handleConfirmDeleteSeries}
      />
      {noteModal && (
        <SwapNoteModal open={noteModal} note={row} onClose={() => setNoteModal(false)} onConfirm={handleAddNote} />
      )}

      {editModal && <EditSeriesModal data={row} open={editModal} onClose={() => setEditModal(false)} />}
    </Base>
  )
}
