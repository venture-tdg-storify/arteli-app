import type { Group } from '@/api/arteli'
import { Suspense, useCallback, useId } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { Swap } from './Swap'
import { SwapItemsProvider } from './SwapContext'

const ModalBox = styled('div')(({ theme: { palette, spacing } }) => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1100,
  backgroundColor: palette.background.tab,
  padding: spacing(0, 3, 3, 3),
  borderRadius: spacing(1),
  position: 'relative'
}))

export const SwapModal: React.FC = () => {
  const navigate = useNavigate()
  const titleId = useId()
  const descriptionId = useId()
  const { groupId } = useParams<{ groupId: Group['id'] }>()
  const { state } = useLocation()
  const { storeIds = [], includeRecentlyAddedGroups = false } = state ?? {}

  const handleClose = useCallback(() => navigate('..'), [navigate])

  if (!storeIds.length) {
    navigate('..')
    return null
  }

  return (
    <SwapItemsProvider groupId={groupId} storeIds={storeIds} includeRecentlyAddedGroups={includeRecentlyAddedGroups}>
      <Modal
        open
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        onClose={handleClose}
      >
        <ModalBox>
          <Stack justifyContent="flex-end" py={0.5}>
            <IconButton onClick={handleClose} sx={{ color: '#748497', mr: -1 }} aria-label="close">
              <Icon className="fa-xmark" />
            </IconButton>
          </Stack>
          <Swap />
        </ModalBox>
      </Modal>
      <TransitionGroup>
        <Suspense>
          <Outlet />
        </Suspense>
      </TransitionGroup>
    </SwapItemsProvider>
  )
}
