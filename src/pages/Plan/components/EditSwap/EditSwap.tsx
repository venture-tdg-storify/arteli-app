import type { ActionStore, ActionType, Store } from '@/api/types.generated'
import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PATH_ACTIVE_ACTION_SET } from '@/routes'
import { EditSwapModal } from './EditSwapModal'

export const EditSwap = () => {
  const navigate = useNavigate()
  const { actionType } = useParams<{ actionType: ActionType }>()
  const { state } = useLocation()
  const { addActionStore, removeActionStore, store } = (state ?? {}) as {
    addActionStore?: ActionStore
    removeActionStore?: ActionStore
    store?: Store
  }

  useEffect(() => {
    if (!store || !addActionStore || !actionType) {
      navigate(PATH_ACTIVE_ACTION_SET)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!store || !addActionStore || !actionType) {
    return null
  }

  return (
    <EditSwapModal
      action={actionType}
      addActionStore={addActionStore}
      removeActionStore={removeActionStore ?? null}
      store={store}
    />
  )
}
