import type { Row } from './useRows'
import type { GridColDef } from '@mui/x-data-grid-pro'
import { useMemo } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { RelativeTimeColumn } from '@/components/grid/RelativeTimeColumn'
import { commonMessages } from '@/utils/messages'
import { ActionColumn } from './components/ActionColumn'
import { ProcessingStatusColumn } from './components/ProcessingStatusColumn'

const messages = defineMessages({
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  type: { defaultMessage: 'Type', id: '+U6ozc' },
  processStatus: { defaultMessage: 'Process Status', id: 'B9Fnxl' },
  processed: { defaultMessage: 'Processed', id: 'YM5KYw' },
  createdBy: { defaultMessage: 'Created By', id: 'uAfuJA' },
  uploaded: { defaultMessage: 'Uploaded', id: 'LwdDVa' },
  clientRank: { defaultMessage: 'Current Series Rankings', id: 'isItlu' },
  productTags: { defaultMessage: 'Product Tags', id: 'iWvEIS' },
  pending: { defaultMessage: 'Pending', id: 'eKEL/g' },
  completed: { defaultMessage: 'Completed', id: '95stPq' },
  completedWithErrors: { defaultMessage: 'Completed With Errors', id: 'Wix7WN' },
  errored: { defaultMessage: 'Errored', id: 'GxWNZ7' },
  processId: { defaultMessage: 'Process ID', id: 'Mz+o0P' },
  sisterSeries: { defaultMessage: 'Sister Series', id: '1pPzYZ' },
  groups: { defaultMessage: 'Groups', id: 'hzmswI' }
})

const userJobTypeMap = {
  ClientRankCsv: messages.clientRank,
  ProductFlagsCsv: messages.productTags,
  SisterSubgroupsCsv: messages.sisterSeries,
  RegionsCsv: messages.groups
}

export const useGridConfiguration = () => {
  const { formatMessage: t } = useIntl()
  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'userJob.name',
        headerName: t(messages.name),
        valueGetter: (_, row: Row) => row?.userJob?.name,
        sortable: true,
        flex: 1
      },
      {
        field: 'userJob.type',
        headerName: t(messages.type),
        valueGetter: (_, row: Row) => {
          const value = row?.userJob?.type
          return value ? t(userJobTypeMap[value]) : ''
        },
        sortable: true,
        width: 170
      },
      {
        field: 'userJob.processingStatus',
        headerName: t(messages.processStatus),
        valueGetter: (_, row: Row) => row?.userJob?.processingStatus,
        sortable: true,
        renderCell: ProcessingStatusColumn,
        width: 170
      },
      {
        field: 'userJob.processingStatusChangedAt',
        headerName: t(messages.processed),
        valueGetter: (_, row: Row) => row?.userJob?.processingStatusChangedAt,
        sortable: false,
        renderCell: RelativeTimeColumn,
        width: 170
      },
      {
        field: 'user.name',
        headerName: t(messages.createdBy),
        valueGetter: (_, row: Row) => row?.user?.name,
        sortable: true,
        width: 170
      },
      {
        field: 'userJob.createdAt',
        headerName: t(messages.uploaded),
        valueGetter: (_, row: Row) => row?.userJob?.createdAt,
        sortable: false,
        renderCell: RelativeTimeColumn,
        width: 170
      },
      {
        field: 'userJob.id',
        headerName: t(messages.processId),
        valueGetter: (_, row: Row) => row?.userJob?.id,
        sortable: true,
        width: 170
      },
      {
        headerName: t(commonMessages.action),
        field: 'user.id',
        sortable: false,
        renderCell: ActionColumn,
        minWidth: 90,
        width: 90
      }
    ],
    [t]
  )

  return { columns }
}
