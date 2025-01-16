import type { ActionStore } from '@/api/types.generated'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/api'
import { PATH_ACTIVE_ACTION_SET } from '@/routes'
import { toast } from '@/store/notifications'
import analytics from '@/utils/analytics'
import { DeleteSwapModal } from './DeleteSwapModal'

const useDestroyActionMutation = api.Arteli.ActionStores.remove.asMutation()

const messages = defineMessages({
  deleted: { defaultMessage: 'Deleted', id: 'KQvWvD' },
  delete: { defaultMessage: 'Delete', id: 'K3r6DQ' }
})

export const DeleteSwap = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { formatMessage: t } = useIntl()
  const { actionStoreId } = useParams<{ actionStoreId: ActionStore['id'] }>()

  useEffect(() => {
    if (!actionStoreId) {
      navigate(PATH_ACTIVE_ACTION_SET)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { mutate: deleteActionStore, isPending } = useDestroyActionMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['action-sets', 'active'] })
      await queryClient.invalidateQueries({ queryKey: ['rows', 'action-stores'] })
      await queryClient.invalidateQueries({ queryKey: ['filtered-ids', 'action-stores'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.deleted))
      handleClose()
    }
  })

  const handleDelete = useCallback(() => {
    if (!actionStoreId) return

    analytics?.track('Delete action store button clicked', { id: actionStoreId })
    deleteActionStore({ params: { id: actionStoreId } })
  }, [actionStoreId, deleteActionStore])

  const handleClose = useCallback(() => {
    navigate('..')
  }, [navigate])

  return <DeleteSwapModal isPending={isPending} onClose={handleClose} onConfirm={handleDelete} />
}
