import type { Row } from './useRows'
import type { UserJobTypesType } from '@/api/types.generated'
import { useCallback, useState } from 'react'
import { HttpError } from '@arteli/http'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import { styled } from '@mui/material/styles'
import { useGridApiRef } from '@mui/x-data-grid-pro'
import { useQueryClient } from '@tanstack/react-query'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import api from '@/api'
import ConfirmModal from '@/components/ConfirmModal'
import { DataGrid } from '@/components/DataGrid/DataGrid'
import ErrorMessage from '@/components/ErrorMessage'
import PageHeader from '@/components/PageHeader'
import { toast } from '@/store/notifications'
import downloadFile from '@/utils/downloadFiles'
import { commonMessages } from '@/utils/messages'
import UploadButtons from './components/UploadButtons'
import { useCsvSample } from './useCsvSample'
import { useGridConfiguration } from './useGridConfiguration'
import { useRows } from './useRows'

const Base = styled('div', { name: 'Container' })(({ theme: { spacing } }) => ({
  paddingRight: spacing(9),
  marginRight: 0,
  paddingLeft: spacing(9),
  height: 'calc(74vh)',
  overflowY: 'auto'
}))

const createUserJobMutation = api.Arteli.UserJob.create.asMutation()

const messages = defineMessages({
  title: { defaultMessage: 'File Successfully Uploaded', id: 'tZqXEi' },
  description: {
    defaultMessage:
      'Files may not be immediately processed. Regularly check for the latest status in the Data Admin Center.',
    id: 'dJiJ6+'
  },
  subtitle: {
    defaultMessage:
      'Customize the application by configuring views and data. You can download example files and upload new data for modifications. Only the most recent file of each type will be used.',
    id: 'DKMXPZ'
  },
  somethingWentWrong: { defaultMessage: 'Something went wrong', id: 'JqiqNj' },
  downloadSample: { defaultMessage: 'Download sample', id: 'mFvUCE' },
  emptyList: { defaultMessage: 'There are no files uploaded yet.', id: 'ytYHD+' },
  close: { defaultMessage: 'Close', id: 'rbrahO' }
})

export function FileUploadCenter() {
  const { rows, isFetching } = useRows()
  const apiRef = useGridApiRef()
  const { columns } = useGridConfiguration()
  const queryClient = useQueryClient()
  const { formatMessage: t } = useIntl()
  const csvSample = useCsvSample()
  const [open, setOpen] = useState(false)

  const { mutate: createUserJob } = createUserJobMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-jobs'] })
    },
    onSuccess: () => {
      setOpen(true)
    },
    onError: async (err) => {
      if (err instanceof HttpError) {
        if (err.response.status === 409) {
          console.log('409')

          return
        }

        toast.Error(t(messages.somethingWentWrong))
      }
    }
  })

  const handleDownloadSample = useCallback(() => {
    downloadFile(csvSample.content, csvSample.fileName, 'text/csv')
  }, [csvSample])

  const handleSubmitFile = async (type: UserJobTypesType, fileContent: string, fileName?: string) => {
    const formData = new FormData()

    formData.append('File', new Blob([fileContent], { type: 'text/csv' }), fileName!)

    createUserJob({ params: { type }, body: formData })
  }

  const getRowId = useCallback(({ userJob }: Row) => userJob.id, [])

  return (
    <div>
      <PageHeader title={t(commonMessages.dataAdminCenter)} subTitle={t(messages.subtitle, { br: <br /> })}>
        <Button sx={{ ml: 'auto', mr: 2 }} onClick={handleDownloadSample}>
          <FormattedMessage {...messages.downloadSample} />
          <Icon className="fa-solid fa-cloud-arrow-down" sx={{ mx: 1 }} />
        </Button>
        <UploadButtons onSubmit={handleSubmitFile} />
      </PageHeader>
      <Base>
        {Boolean(rows?.length) && (
          <DataGrid
            apiRef={apiRef}
            getRowId={getRowId}
            rows={rows}
            columns={columns}
            rowSelection={false}
            columnBufferPx={1280}
          />
        )}
        {!isFetching && rows?.length === 0 && (
          <Box sx={{ height: 240, position: 'relative' }}>
            <ErrorMessage>
              <FormattedMessage {...messages.emptyList} />
            </ErrorMessage>
          </Box>
        )}
      </Base>
      <ConfirmModal
        title={t(messages.title)}
        description={t(messages.description)}
        confirmLabel={t(messages.close)}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        hideSkipButton={true}
        size="small"
        inverted
      />
    </div>
  )
}
