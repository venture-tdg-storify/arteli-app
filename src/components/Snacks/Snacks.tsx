import React from 'react'
import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import { styled } from '@mui/material/styles'
import { notifications, removeSnack } from '@/store/notifications'

const Base = styled('div', { name: 'Container' })(({ theme: { zIndex, spacing } }) => ({
  position: 'fixed',
  zIndex: zIndex.snackbar,
  left: '50%',
  transform: 'translateX(-50%)',
  marginTop: spacing(4),
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  top: 0
}))

export const Snacks: React.FC = () => {
  const { snacks } = notifications.use()

  return (
    <Base>
      {snacks.map((snack) => (
        <Slide key={snack.id} direction="up" in mountOnEnter unmountOnExit>
          <Alert
            onClose={() => removeSnack(snack.id)}
            severity={snack.type}
            sx={(theme) => ({ mb: 2, backgroundColor: theme.palette.background.paper })}
          >
            {snack.message}
          </Alert>
        </Slide>
      ))}
    </Base>
  )
}
