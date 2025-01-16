import type { Row } from '../useRows'
import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { FormattedMessage } from 'react-intl'
import { useActionSetCsvDownload } from '@/hooks/useActionSetCsvDownload'
import { useActiveActionSet } from '@/hooks/useActiveActionSet'
import analytics from '@/utils/analytics'
import { commonMessages } from '@/utils/messages'

export const ActionColumn = ({ row: { actionSet } }: GridRenderCellParams<Row>) => {
  const [csvId, setCsvId] = useState<string | null>(null)

  const { download } = useActionSetCsvDownload()
  const { rows, isFetching } = useActiveActionSet({ id: csvId })

  const handleDownload = useCallback(async () => {
    if (!actionSet || actionSet.status !== 'Finalized') return
    setCsvId(actionSet.id)
  }, [actionSet])

  useEffect(() => {
    if (csvId && rows?.length && !isFetching && actionSet?.status === 'Finalized') {
      const sortedRows = [...rows]
        .sort((a, b) => Date.parse(b.actionStore.createdAt) - Date.parse(a.actionStore.createdAt))
        .sort((a, b) => (a.actionStore.dependentId === b.actionStore.id ? 0 : 1))
        .sort((a, b) => a.store.externalId?.localeCompare(b.store.externalId || '') || 0)
      download(sortedRows, actionSet)
      setCsvId(null)
    }
  }, [actionSet, csvId, download, isFetching, rows])

  if (!actionSet || actionSet.status !== 'Finalized') return null

  return (
    <Stack justifyContent="flex-start" alignContent="center" sx={{ height: '100%' }}>
      <Button
        variant="outlined"
        size="small"
        color="secondary"
        sx={{ px: 4 }}
        onClickCapture={(event) => {
          event.preventDefault()
          event.stopPropagation()
          analytics?.track('CSV button clicked', { actionSetId: actionSet.id })
          handleDownload()
        }}
        disabled={isFetching}
      >
        <Icon className="fa-solid fa-cloud-arrow-down" sx={{ mr: 2 }} />
        <FormattedMessage {...commonMessages.plan} />
      </Button>
    </Stack>
  )
}
