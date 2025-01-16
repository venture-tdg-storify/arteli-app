import type { Group, RecNote } from '@/api/types.generated'
import { useCallback, useMemo, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import api from '@/api'
import { useFilters } from '@/hooks/useFilters'
import { toast } from '@/store/notifications'
import { commonMessages } from '@/utils/messages'
import { NoteEdit } from './NoteEdit'
import { NotesList } from './NotesList'

const useSingleRecNotesQuery = api.Arteli.RecNotes.find.asQuery()
const useRemoveSingleRecNoteMutation = api.Arteli.RecNotes.remove.asMutation()
const useAddSingleRecNotesMutation = api.Arteli.RecNotes.create.asMutation()
const useUpdateSingleRecNotesMutation = api.Arteli.RecNotes.update.asMutation()

const MainWrapper = styled('div', { name: 'notes-main-wrapper' })(({ theme: { spacing } }) => ({
  padding: spacing(2, 0)
}))

const messages = defineMessages({
  deleted: { defaultMessage: 'Note deleted', id: '6+fUO9' },
  noteCreated: { defaultMessage: 'Note created', id: '3W+o3u' },
  noteUpdated: { defaultMessage: 'Note updated', id: 'gfRbEV' }
})

const MAX_PER_PAGE = 10

export const Notes = ({ groupId }: { groupId: Group['id'] }) => {
  const [limit, setLimit] = useState(1)
  const [note, setNote] = useState('')
  const [editNote, setEditNote] = useState<RecNote | null>(null)
  const { storeIds, categoryId, subcategoryIds } = useFilters()
  const { formatMessage: t } = useIntl()
  const queryClient = useQueryClient()

  const { data: notes, isFetching } = useSingleRecNotesQuery({
    params: {
      categoryId: categoryId ?? '',
      groupIds: [groupId],
      storeIds,
      subcategoryIds,
      limit: limit * MAX_PER_PAGE
    },
    enabled: Boolean(storeIds.length)
  })

  const hasMore = useMemo(() => notes?.length === limit * MAX_PER_PAGE, [notes, limit])
  const handleLoadMore = useCallback(() => {
    setLimit((prev) => prev + 1)
  }, [])

  const { mutate: deleteNote, variables } = useRemoveSingleRecNoteMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rec-notes'] })
    },
    onSuccess: () => {
      if (variables?.params?.id === editNote?.id) {
        handleSet(null)
      }
      toast.Success(t(messages.deleted))
    }
  })

  const { mutate: addNote, isPending: isPendingAdding } = useAddSingleRecNotesMutation({
    onSuccess: () => {
      handleSet(null)
      toast.Success(t(messages.noteCreated))
    },
    onError: (error) => {
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const { mutate: updateNote, isPending: isPendingUpdating } = useUpdateSingleRecNotesMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rec-notes'] })
    },
    onSuccess: () => {
      handleSet(null)
      toast.Success(t(messages.noteUpdated))
    },
    onError: (error) => {
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const handleSet = useCallback((note: RecNote | null) => {
    setEditNote(note)
    setNote(note ? note.content : '')
  }, [])

  const handleEdit = useCallback(() => {
    if (!note) return

    if (editNote) {
      updateNote({ params: { id: editNote.id }, body: { content: note } })
    } else {
      addNote({
        body: {
          groupId,
          content: note,
          categoryId: categoryId ?? '',
          subcategoryIds,
          storeIds
        }
      })
      return
    }
  }, [note, editNote, updateNote, addNote, groupId, categoryId, subcategoryIds, storeIds])

  const handleDelete = useCallback(
    (id: RecNote['id']) => {
      deleteNote({ params: { id } })
    },
    [deleteNote]
  )

  return (
    <MainWrapper>
      <NoteEdit
        note={note}
        onSet={setNote}
        isEditing={Boolean(editNote)}
        isPending={isPendingAdding || isPendingUpdating}
        onCancel={handleSet}
        onEdit={handleEdit}
      />
      <NotesList
        notes={notes}
        hasMore={hasMore}
        loadMore={handleLoadMore}
        isFetching={isFetching}
        onEdit={handleSet}
        onDelete={handleDelete}
      />
    </MainWrapper>
  )
}
