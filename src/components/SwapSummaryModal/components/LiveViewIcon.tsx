import type { Store } from '@/api/types.generated'
import { useCallback } from 'react'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { defineMessages, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

const messages = defineMessages({
  liveView: { defaultMessage: 'See products currently on the floor', id: 'eTm3Pt' }
})

export const LiveViewIcon = ({ storeId }: { storeId: Store['id'] }) => {
  const { formatMessage: t } = useIntl()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { storeIds = [] } = state ?? {}

  const handleClick = useCallback(() => {
    navigate(`./live-view/${storeId}`, { state: { storeIds } })
  }, [navigate, storeId, storeIds])

  return (
    <Tooltip title={t(messages.liveView)}>
      <IconButton onClick={handleClick} color="primary" aria-label="live view">
        <Icon className="fa-shop" />
      </IconButton>
    </Tooltip>
  )
}
