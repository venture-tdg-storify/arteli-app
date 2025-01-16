import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import ConfirmModal from '@/components/ConfirmModal'
import { commonMessages } from '@/utils/messages'

const messages = defineMessages({
  title: { defaultMessage: 'Delete Swap', id: 'rJlnuv' },
  description: {
    defaultMessage: 'Please be aware that you are deleting this swap from the plan. Do you wish to proceed?',
    id: 'jxqT1c'
  },
  confirm: { defaultMessage: 'Confirm Delete', id: 't/BlH4' }
})

export const DeleteSwapModal = ({
  open = true,
  onClose,
  onConfirm,
  isPending
}: {
  open?: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}) => {
  return (
    <ConfirmModal
      title={
        <Typography fontSize={20} fontWeight="bold">
          <FormattedMessage {...messages.title} />
        </Typography>
      }
      description={
        <Typography fontSize={16} fontWeight="bold">
          <FormattedMessage {...messages.description} />
        </Typography>
      }
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      cancelLabel={<FormattedMessage {...commonMessages.cancel} />}
      confirming={isPending}
      inverted
    />
  )
}
