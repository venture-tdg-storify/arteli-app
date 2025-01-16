import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { PATH_ACTIVE_ACTION_SET } from '@/routes'
import ConfirmModal from '../../ConfirmModal'

const messages = defineMessages({
  title: { defaultMessage: 'Approved Swaps', id: 'zKE8Mh' },
  description: {
    defaultMessage:
      'You’ve completed {count} {count, plural, one {swap} other {swaps}}! You can review these changes in your Plan or continue to review additional recommendations.',
    id: 'R11044'
  },
  fromPlanDescription: {
    defaultMessage: 'You’ve completed {count} {count, plural, one {swap} other {swaps}}!',
    id: '8WUWWF'
  },
  confirm: { defaultMessage: 'Review Plan', id: '3IL+Rb' },
  back: { defaultMessage: 'Back to Recommendations', id: 'irOCS+' }
})

export const SwapCreatedModal = ({
  open,
  count,
  onClose,
  fromPlan
}: {
  open: boolean
  count: number
  onClose: () => void
  fromPlan: boolean
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleConfirm = useCallback(async () => {
    if (fromPlan) {
      await queryClient.invalidateQueries({ queryKey: ['action-sets', 'active'] })
      await queryClient.invalidateQueries({ queryKey: ['rows', 'action-stores'] })
      await queryClient.invalidateQueries({ queryKey: ['filtered-ids', 'action-stores'] })
      onClose()
    } else {
      navigate({ pathname: PATH_ACTIVE_ACTION_SET, search: location.search })
    }
  }, [fromPlan, navigate, onClose, queryClient])

  return (
    <ConfirmModal
      title={<FormattedMessage {...messages.title} />}
      description={
        <FormattedMessage {...(fromPlan ? messages.fromPlanDescription : messages.description)} values={{ count }} />
      }
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      cancelLabel={<FormattedMessage {...messages.back} />}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConfirm}
      inverted
      size="medium"
      hideSkipButton={fromPlan}
    />
  )
}
