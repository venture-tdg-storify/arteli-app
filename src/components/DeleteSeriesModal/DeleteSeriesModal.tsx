import { defineMessages, useIntl } from 'react-intl'
import ConfirmModal from '../ConfirmModal'

const messages = defineMessages({
  title: { defaultMessage: 'Delete Series', id: 'sH/2RD' },
  description: {
    defaultMessage:
      'Deleting this series will add the new series to the Plan without removing the current one, resulting in an additional series in the store. Do you want to proceed?',
    id: 'g1nBu6'
  },
  confirm: { defaultMessage: 'Confirm Delete', id: 't/BlH4' }
})

export const DeleteSeriesModal = ({
  open,
  onClose,
  onConfirm,
  isPending = false
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
}) => {
  const { formatMessage: t } = useIntl()

  return (
    <ConfirmModal
      title={t(messages.title)}
      description={t(messages.description)}
      confirmLabel={t(messages.confirm)}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      hideSkipButton
      inverted
      confirming={isPending}
    />
  )
}
