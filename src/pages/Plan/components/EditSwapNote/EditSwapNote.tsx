import type { ActionStore, Store } from '@/api/types.generated'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '@/api'
import { PATH_ACTIVE_ACTION_SET } from '@/routes'
import { toast } from '@/store/notifications'
import { commonMessages } from '@/utils/messages'
import { SwapNoteModal } from './SwapNoteModal'

const useUpdateNoteMutation = api.Arteli.ActionStores.updateNote.asMutation()

const messages = defineMessages({
  noteSaved: { defaultMessage: 'Note saved', id: 'b9vEQx' }
})

export const EditSwapNote = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { formatMessage: t } = useIntl()

  const { state } = useLocation()
  const { addActionStore, removeActionStore, store } = (state ?? {}) as {
    addActionStore?: ActionStore
    removeActionStore?: ActionStore
    store?: Store
  }

  useEffect(() => {
    if (!store || !addActionStore) {
      navigate(PATH_ACTIVE_ACTION_SET)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { mutate: updateActionStore, isPending } = useUpdateNoteMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rows', 'action-stores'] })
      handleClose()
    },
    onSuccess: () => {
      toast.Success(t(messages.noteSaved))
    },
    onError: (error) => {
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const handleConfirm = useCallback(
    (note: string) => {
      if (!addActionStore) {
        return
      }
      updateActionStore({ params: { id: addActionStore.id }, body: note })
    },
    [addActionStore, updateActionStore]
  )

  const handleClose = useCallback(() => {
    navigate('..')
  }, [navigate])

  if (!store || !addActionStore) {
    return null
  }

  return (
    <SwapNoteModal
      addActionStore={addActionStore}
      removeActionStore={removeActionStore ?? null}
      store={store}
      isPending={isPending}
      onCancel={handleClose}
      onConfirm={handleConfirm}
    />
  )
}
