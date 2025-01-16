import { useCallback, useMemo, useState } from 'react'
import TextField from '@mui/material/TextField'
import { defineMessages, useIntl } from 'react-intl'
import ConfirmModal from '@/components/ConfirmModal'

const messages = defineMessages({
  title: { defaultMessage: 'Edit Plan', id: 'EjaT+N' },
  done: { defaultMessage: 'Done', id: 'JXdbo8' },
  cancel: { defaultMessage: 'Cancel', id: '47FYwb' },
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  planName: { defaultMessage: 'Plan Name', id: '8shesJ' }
})

export const RenamePlanModal = ({
  value,
  open,
  onClose,
  onConfirm,
  isPending = false
}: {
  value: string
  open: boolean
  onClose: () => void
  onConfirm: (_: string) => void
  isPending?: boolean
}) => {
  const [name, setName] = useState(value)
  const { formatMessage: t } = useIntl()

  const error = useMemo(() => name.length === 0, [name])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleConfirm = useCallback(() => {
    if (error) return
    onConfirm(name)
  }, [error, name, onConfirm])

  return (
    <ConfirmModal
      title={t(messages.title)}
      description={undefined}
      confirmLabel={t(messages.done)}
      cancelLabel={t(messages.cancel)}
      size="medium"
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={error ? undefined : handleConfirm}
      inverted
      confirming={isPending}
    >
      <TextField
        label={t(messages.planName)}
        value={name}
        size="small"
        fullWidth
        onChange={handleTextChange}
        error={error}
        helperText={error && t(messages.required)}
        sx={{ mt: 4 }}
      />
    </ConfirmModal>
  )
}
