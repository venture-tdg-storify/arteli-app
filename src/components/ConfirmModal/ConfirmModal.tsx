import type { ReactNode } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { FormattedMessage, defineMessages } from 'react-intl'
import Modal from '../Modal'

const messages = defineMessages({
  confirm: { defaultMessage: 'Confirm', id: 'N2IrpM' },
  back: { defaultMessage: 'Back', id: 'cyR7Kh' }
})

type ModalProps = React.ComponentProps<typeof Modal>

type ConfirmButtonsProps = {
  onConfirm?: () => void
  onCancel: () => void
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  confirming?: boolean
  inverted?: boolean
  hideSkipButton?: boolean
  hideConfirmButton?: boolean
  topMargin?: number
}

export const ConfirmButtons = ({
  onConfirm,
  confirmLabel,
  onCancel,
  cancelLabel,
  confirming,
  inverted = false,
  hideSkipButton = false,
  hideConfirmButton = false,
  topMargin = 6
}: ConfirmButtonsProps) => {
  return (
    <Stack spacing={3} sx={{ mt: topMargin }} direction={inverted ? 'row-reverse' : 'row'}>
      {!hideConfirmButton && (
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={onConfirm}
          fullWidth
          loading={confirming}
          disabled={!onConfirm}
        >
          {confirmLabel || <FormattedMessage {...messages.confirm} />}
        </LoadingButton>
      )}
      {!hideSkipButton && (
        <Button onClick={onCancel} variant="outlined" color="primary" fullWidth disabled={confirming}>
          {cancelLabel || <FormattedMessage {...messages.back} />}
        </Button>
      )}
    </Stack>
  )
}

type ConfirmModalProps = ModalProps & ConfirmButtonsProps

export function ConfirmModal({
  children = null,
  onConfirm,
  confirmLabel,
  onCancel,
  cancelLabel,
  confirming,
  topMargin,
  inverted,
  hideSkipButton,
  hideConfirmButton,
  ...modalProps
}: ConfirmModalProps) {
  return (
    <Modal {...modalProps}>
      {children}
      <ConfirmButtons
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        confirming={confirming}
        inverted={inverted}
        hideSkipButton={hideSkipButton}
        hideConfirmButton={hideConfirmButton}
        topMargin={topMargin}
      />
    </Modal>
  )
}
