import type { ActionStorePerf } from '@/api/types.generated'
import { useCallback } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCSVDownload } from '../useCSVDownload'

const messages = defineMessages({
  downloadReport: { defaultMessage: 'Download Report', id: 'iHdvdj' }
})

export const DownloadAction = ({
  disabled,
  rows,
  showRemoved
}: {
  disabled: boolean
  rows: ActionStorePerf[]
  showRemoved: boolean
}) => {
  const { download } = useCSVDownload(showRemoved)

  const handleDownload = useCallback(async () => {
    download(rows)
  }, [download, rows])

  return (
    <Button color="secondary" variant="outlined" onClick={handleDownload} disabled={disabled}>
      <FormattedMessage {...messages.downloadReport} />
      <Icon className="fa-solid fa-cloud-arrow-down" sx={{ ml: 1 }} />
    </Button>
  )
}
