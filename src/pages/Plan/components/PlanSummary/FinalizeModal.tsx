import type { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import ConfirmModal from '@/components/ConfirmModal'
import { OverdueDatePicker } from './OverdueDatePicker'

const messages = defineMessages({
  title: { defaultMessage: 'Finalize Plan', id: 'T2J+2x' },
  description: {
    defaultMessage:
      'Are you sure that you want to finalize the current Plan?\nIf confirmed, the plan will no longer be able to be modified.',
    id: 'dsskTd'
  },
  status: {
    defaultMessage:
      'There are issues with the swap entries created. You can still finalize the plan, but the swaps entered may not be able to be successfully completed.',
    id: '8P/Lrw'
  },
  planName: { defaultMessage: 'Plan Name', id: '8shesJ' },
  placeholder: { defaultMessage: 'Enter Plan Name', id: 'rARyYf' }
})

export const FinalizeModal = ({
  open,
  name,
  overdueDate,
  showStatus,
  pending,
  onClose,
  onFinalize,
  onSetName,
  onSetDate
}: {
  open: boolean
  name: string
  overdueDate: Dayjs | null
  showStatus: boolean
  pending: boolean
  onClose: () => void
  onFinalize: () => void
  onSetName: (name: string) => void
  onSetDate: (date: Dayjs | null) => void
}) => {
  const { formatMessage: t } = useIntl()

  return (
    <ConfirmModal
      title={t(messages.title)}
      description={t(messages.description)}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onFinalize}
      confirming={pending}
      inverted
      size="medium"
    >
      <TextField
        label={t(messages.planName)}
        placeholder={t(messages.placeholder)}
        value={name}
        fullWidth
        onChange={(e) => onSetName(e.target.value)}
        sx={{ mt: 2 }}
        focused
      />
      {overdueDate && <OverdueDatePicker overdueDate={overdueDate} onChange={onSetDate} />}
      {showStatus && (
        <Typography color="error" mt={4}>
          <FormattedMessage {...messages.status} />
        </Typography>
      )}
    </ConfirmModal>
  )
}
