import type { RecNote } from '@/api/types.generated'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Note } from '@/components/Notes/Note'
import { commonMessages } from '@/utils/messages'

const messages = defineMessages({
  addNote: { defaultMessage: 'Add a note', id: 'dTW4m3' },
  editNote: { defaultMessage: 'Edit note', id: 'v+W2VX' }
})

export const NoteEdit = ({
  note,
  onSet,
  isEditing,
  onCancel,
  onEdit,
  isPending
}: {
  note: string
  onSet: (note: string) => void
  isEditing: boolean
  onCancel: (note: RecNote | null) => void
  onEdit: () => void
  isPending: boolean
}) => {
  const placeholder = isEditing ? messages.editNote : messages.addNote
  const actionLabel = isEditing ? commonMessages.confirm : commonMessages.add

  return (
    <Stack direction="column" spacing={1}>
      <Note note={note} onNoteChange={onSet} placeholder={placeholder} />
      <Stack direction="row" spacing={2} width="100%" justifyContent="center">
        {isEditing && (
          <Button variant="outlined" color="primary" onClick={() => onCancel(null)} disabled={isPending} fullWidth>
            <FormattedMessage {...commonMessages.cancel} />
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          disabled={isPending}
          onClick={onEdit}
          fullWidth={Boolean(isEditing)}
          sx={{ minWidth: 180 }}
        >
          <FormattedMessage {...actionLabel} />
        </Button>
      </Stack>
    </Stack>
  )
}
