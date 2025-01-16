import { defineMessages, useIntl } from 'react-intl'
import ConfirmModal from '../../ConfirmModal'

const messages = defineMessages({
  title: { defaultMessage: 'Delete Store from Recommendation', id: 'KOE0pp' },
  description: {
    defaultMessage: 'Please be aware that you are deleting a store from this Series recommendation. ',
    id: 'QhvX5U'
  },
  confirm: { defaultMessage: 'Confirm Delete', id: 't/BlH4' }
})

export const DeleteStoreModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
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
    />
  )
}
