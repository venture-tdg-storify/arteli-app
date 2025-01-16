import type { RecNote, TenantUser } from '@/api/types.generated'
import { useCallback } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FormattedDate, FormattedTime } from 'react-intl'
import { useMe } from '@/hooks/useMe'
import { ActionMenu } from './ActionMenu'

export const NoteItem = ({
  note,
  user,
  onEdit,
  onDelete
}: {
  note: RecNote
  user: TenantUser
  onEdit: (note: RecNote) => void
  onDelete: (id: RecNote['id']) => void
}) => {
  const { user: me } = useMe()

  const handleEdit = useCallback(() => {
    onEdit(note)
  }, [note, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(note.id)
  }, [note.id, onDelete])

  return (
    <Stack direction="column" key={note.id} borderBottom="1px solid rgba(241, 243, 245, 1)" py={1}>
      <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
        <Typography fontSize={12} color="textDisabled">
          {user.name}
        </Typography>
        {user.email === me.email && user.name === me.name && <ActionMenu onEdit={handleEdit} onDelete={handleDelete} />}
      </Stack>
      <Typography py={1} alignSelf="flex-start" fontSize={14} color="textPrimary">
        {note.content}
      </Typography>
      <Typography alignSelf="flex-end" fontSize={12} color="textDisabled">
        <FormattedDate value={note.updatedAt} /> <FormattedTime value={note.updatedAt} />
      </Typography>
    </Stack>
  )
}
