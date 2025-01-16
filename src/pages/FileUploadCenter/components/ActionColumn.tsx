import type { Row } from '../useRows'
import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useCallback } from 'react'
import IconButton from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { defineMessages, useIntl } from 'react-intl'
import api from '@/api'
import { toast } from '@/store/notifications'
import downloadFile from '@/utils/downloadFiles'
const useJobContentQuery = api.Arteli.UserJob.getContent.asQuery()

const messages = defineMessages({
  downloadError: { defaultMessage: 'An error occurred while downloading the file.', id: '6lovOr' }
})

export const ActionColumn = ({ row: { userJob } }: GridRenderCellParams<Row>) => {
  const { formatMessage: t } = useIntl()

  const { refetch, isFetching } = useJobContentQuery({ params: { id: userJob.id ?? '' }, enabled: false })

  const handleDownload = useCallback(async () => {
    const { data: text } = await refetch()

    if (!text) {
      toast.Error(t(messages.downloadError))
      return
    }

    downloadFile(text, userJob.name ?? 'csv', 'text/csv')
  }, [userJob.name, refetch, t])

  return (
    <Stack justifyContent="flex-end" alignContent="center" sx={{ height: '100%' }}>
      <IconButton
        size="small"
        color="secondary"
        onClickCapture={(event) => {
          event.preventDefault()
          event.stopPropagation()

          handleDownload()
        }}
        disabled={isFetching}
        fullWidth={false}
      >
        <Icon className="fa-solid fa-cloud-arrow-down" />
      </IconButton>
    </Stack>
  )
}
