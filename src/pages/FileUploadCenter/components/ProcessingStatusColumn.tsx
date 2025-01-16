import type { Row } from '../useRows'
import type { UserJobTypesProcessingStatus } from '@/api/types.generated'
import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import type { MessageDescriptor } from 'react-intl'
import { useState } from 'react'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import { ErrorsModal } from './ErrorsModal'

const messages = defineMessages({
  pending: { defaultMessage: 'Pending', id: 'eKEL/g' },
  completed: { defaultMessage: 'Completed', id: '95stPq' },
  viewErrors: { defaultMessage: 'View Errors', id: 'sAufYp' },
  failed: { defaultMessage: 'Failed', id: 'vXCeIi' },
  withErrors: { defaultMessage: 'Completed with errors', id: '9tBA7K' }
})

const userJobProcessingStatusMap: Record<UserJobTypesProcessingStatus, MessageDescriptor> = {
  Pending: messages.pending,
  Completed: messages.completed,
  CompletedWithErrors: messages.withErrors,
  Failed: messages.failed
}

export const ProcessingStatusColumn = ({
  row,
  value: status
}: GridRenderCellParams<Row, UserJobTypesProcessingStatus>) => {
  const [open, setOpen] = useState(false)

  if (!status) return null

  const errors = row?.userJob.errors

  const icon = errors && Object.keys(errors).length > 0 && (
    <>
      <Tooltip title={<FormattedMessage {...messages.viewErrors} />}>
        <IconButton
          aria-label="delete"
          onClick={() => {
            setOpen(true)
          }}
        >
          <Icon className="fa-triangle-exclamation" component="span" color="error" sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
      <ErrorsModal onClose={() => setOpen(false)} open={open} errors={errors} />
    </>
  )

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" height="100%">
      <Typography variant="body2" overflow="hidden" textOverflow="ellipsis" gutterBottom={false}>
        <FormattedMessage {...userJobProcessingStatusMap[status]} />
      </Typography>
      {icon}
    </Stack>
  )
}
