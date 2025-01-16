import type { ReactNode } from 'react'
import { useId } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import MUIModal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import styled from '@mui/material/styles/styled'
import Typography from '@mui/material/Typography'

const ModalBox = styled('div')<{ size: 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge' }>(
  ({ theme: { palette, spacing }, size }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      small: 450,
      medium: 600,
      large: 800,
      xLarge: 1000,
      xxLarge: 1200
    }[size],
    backgroundColor: palette.background.tab,
    padding: spacing(0, 3, 3, 3),
    borderRadius: spacing(1),
    maxHeight: '99vh'
  })
)

type ModalProps = {
  children?: ReactNode
  title: ReactNode
  description: ReactNode
  open: boolean
  onClose: () => void
  onBack?: () => void
  size?: 'small' | 'medium' | 'large' | 'xLarge' | 'xxLarge'
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  description,
  open,
  onClose,
  onBack,
  size = 'small'
}) => {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <MUIModal
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <ModalBox size={size}>
          <Stack sx={{ minHeight: 56 }} justifyContent={title ? 'space-between' : 'flex-end'}>
            {title && (
              <Stack direction="row" spacing={1}>
                {onBack && (
                  <IconButton onClick={onBack} sx={{ color: '#748497' }} aria-label="back">
                    <Icon className="fa-chevron-left" />
                  </IconButton>
                )}
                <Typography
                  id={titleId}
                  sx={({ typography }) => ({ fontSize: 20, fontWeight: typography.fontWeightBold, py: 2 })}
                  component="div"
                >
                  {title}
                </Typography>
              </Stack>
            )}
            <IconButton onClick={onClose} sx={{ color: '#748497' }} aria-label="close">
              <Icon className="fa-xmark" />
            </IconButton>
          </Stack>
          {Boolean(description) && (
            <Typography id={descriptionId} sx={{ fontSize: 16, mb: 2 }} component="div">
              {description}
            </Typography>
          )}
          {children}
        </ModalBox>
      </Fade>
    </MUIModal>
  )
}
