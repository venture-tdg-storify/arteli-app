import type { ActionStore, Product, Store } from '@/api/types.generated'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '@/api'
import { PATH_ACTIVE_ACTION_SET } from '@/routes'
import { toast } from '@/store/notifications'
import { commonMessages } from '@/utils/messages'
import { SwapProductsModal } from './SwapProductsModal'

const useUpdateActionStoreMutation = api.Arteli.ActionStores.update.asMutation()

const messages = defineMessages({
  productsSaved: { defaultMessage: 'Products saved', id: 'vQ3wSq' }
})

const getParams = (actionStore: ActionStore) => ({
  categoryId: actionStore.categoryId,
  subcategoryId: actionStore.subcategoryId,
  groupId: actionStore.groupId,
  note: actionStore.note
})

export const EditSwapProducts = () => {
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

  const { mutate: updateActionStore, isPending } = useUpdateActionStoreMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['action-sets', 'active'] })
      await queryClient.invalidateQueries({ queryKey: ['rows', 'action-stores'] })
      await queryClient.invalidateQueries({ queryKey: ['filtered-ids', 'action-stores'] })
      handleClose()
    },
    onSuccess: () => {
      toast.Success(t(messages.productsSaved))
    },
    onError: (error) => {
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const handleConfirm = useCallback(
    (productIds: Product['id'][]) => {
      if (!addActionStore) {
        return
      }
      updateActionStore({
        params: { id: addActionStore.id },
        body: {
          actionType: 'Add',
          storeId: addActionStore.storeId,
          productIds,
          ...getParams(addActionStore),
          swap: removeActionStore ? getParams(removeActionStore) : null
        }
      })
    },
    [addActionStore, removeActionStore, updateActionStore]
  )

  const handleClose = useCallback(() => {
    navigate('..')
  }, [navigate])

  if (!store || !addActionStore) {
    return null
  }

  return (
    <SwapProductsModal
      addActionStore={addActionStore}
      removeActionStore={removeActionStore ?? null}
      store={store}
      isPending={isPending}
      onCancel={handleClose}
      onConfirm={handleConfirm}
    />
  )
}
