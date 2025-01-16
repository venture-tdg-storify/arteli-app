import type { ActionStore, Store } from '@/api/types.generated'
import { useCallback, useState } from 'react'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import ConfirmModal from '@/components/ConfirmModal'
import { Note } from '@/components/Notes/Note'
import { SwapInfo } from '../SwapInfo'

const messages = defineMessages({
  title: { defaultMessage: 'Edit Swap Note', id: 'O0yFmY' },
  confirm: { defaultMessage: 'Confirm', id: 'N2IrpM' },
  notes: { defaultMessage: 'Swap Note', id: 'EYvht3' }
})

export const SwapNoteModal = ({
  addActionStore,
  removeActionStore,
  store,
  isPending,
  onCancel,
  onConfirm,
  open = true
}: {
  addActionStore: ActionStore
  removeActionStore: ActionStore | null
  store: Store
  isPending: boolean
  onConfirm: (note: string) => void
  onCancel: () => void
  open?: boolean
}) => {
  const [content, setContent] = useState(addActionStore.note ?? '')

  const handleConfirm = useCallback(() => {
    onConfirm(content)
  }, [content, onConfirm])

  return (
    <ConfirmModal
      title={
        <Typography fontSize={20} fontWeight="bold">
          <FormattedMessage {...messages.title} />
        </Typography>
      }
      description={
        <Typography fontSize={16} fontWeight="bold">
          {store.externalId + ' ' + store.name}
        </Typography>
      }
      open={open}
      onClose={onCancel}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      size="large"
      topMargin={3}
      inverted
      hideSkipButton={true}
      confirming={isPending}
    >
      <SwapInfo addActionStore={addActionStore} removeActionStore={removeActionStore} />
      <Typography fontSize={18} mb={1}>
        <FormattedMessage {...messages.notes} />
      </Typography>
      <Note onNoteChange={setContent} note={content} />
    </ConfirmModal>
  )
}
