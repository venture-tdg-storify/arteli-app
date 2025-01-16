import type { Store } from '@/api/types.generated'
import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LiveViewModal } from './LiveViewModal'

export const LiveView = () => {
  const navigate = useNavigate()
  const { liveViewStoreId } = useParams<{ liveViewStoreId: Store['id'] }>()

  useEffect(() => {
    if (!liveViewStoreId) {
      navigate(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const handleClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  if (!liveViewStoreId) return null

  return <LiveViewModal open storeId={liveViewStoreId} onClose={handleClose} />
}
