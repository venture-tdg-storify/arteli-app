import type { RecNote } from '@/api/types.generated'
import { useMemo } from 'react'
import { groupById } from '@arteli/utils'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useUserByIdsQuery } from '@/hooks/arteli'
import { NoteItem } from './NoteItem'

const messages = defineMessages({
  loadMore: { defaultMessage: 'Load more', id: '00LcfG' }
})

const NotesWrapper = styled('div')(({ theme: { spacing } }) => ({
  overflow: 'auto',
  width: '100%',
  padding: spacing(2, 0)
}))

export const NotesList = ({
  notes,
  hasMore,
  loadMore,
  isFetching,
  onEdit,
  onDelete
}: {
  notes?: RecNote[]
  hasMore: boolean
  loadMore: () => void
  isFetching: boolean
  onEdit: (note: RecNote) => void
  onDelete: (id: RecNote['id']) => void
}) => {
  const userIds = useMemo(() => notes?.map((_) => _.tenantUserId) ?? [], [notes])
  const { data: users } = useUserByIdsQuery({
    params: { ids: userIds },
    enabled: Boolean(userIds.length)
  })

  const usersById = groupById(users ?? [])

  return (
    <Stack direction="column" spacing={1} height="100%">
      <NotesWrapper>
        {notes &&
          users &&
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              user={usersById[note.tenantUserId]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        {hasMore && (
          <Button
            onClick={loadMore}
            disabled={isFetching}
            sx={{ mt: 1, width: '100%', textDecoration: 'underline', fontSize: 18, color: 'text.primary' }}
          >
            <FormattedMessage {...messages.loadMore} />
          </Button>
        )}
      </NotesWrapper>
    </Stack>
  )
}
