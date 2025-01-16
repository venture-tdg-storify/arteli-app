import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import ConfirmModal from '@/components/ConfirmModal'
import { commonMessages } from '@/utils/messages'

const messages = defineMessages({
  title: { defaultMessage: 'Revert Demo', id: '6vi9aj' },
  description: {
    defaultMessage:
      'Are you sure that you want to revert the demo database and remove all changes made by non staff users?',
    id: 'JbOG1X'
  },
  confirm: { defaultMessage: 'Confirm Revert', id: 'W7yu3X' }
})

export const RevertDemoModal = ({
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
        <Typography fontSize={16}>
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
