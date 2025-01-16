import type { Row } from './useRows'
import type { GridColDef } from '@mui/x-data-grid-pro'
import { useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useGridApiRef } from '@mui/x-data-grid-pro'
import dayjs from 'dayjs'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { DataGrid } from '@/components/DataGrid/DataGrid'
import ErrorMessage from '@/components/ErrorMessage'
import { DateColumn } from '@/components/grid/DateColumn'
import { ActionColumn } from './components/ActionColumn'
import { NameColumn } from './components/NameColumn'
import { useRows } from './useRows'

const messages = defineMessages({
  plansDescription: { defaultMessage: 'Download approved plans.', id: 'J5sxOt' },
  created: { defaultMessage: 'Date Created', id: 'jY/3Cs' },
  finalizedBy: { defaultMessage: 'Finalized By', id: 'WAdFAT' },
  updated: { defaultMessage: 'Modified', id: 'tOxzip' },
  finalizedAt: { defaultMessage: 'Date Finalized', id: 'BgPgfX' },
  emptyPlanList: { defaultMessage: 'There are no finalized plans jet.', id: '1fjHtv' },
  dateOverdue: { defaultMessage: 'Date Overdue', id: 'vSbqjm' },
  file: { defaultMessage: 'File', id: 'gyrIEl' },
  name: { defaultMessage: 'Name', id: 'HAlOn1' }
})

export function ActionSetList() {
  const { formatMessage: t } = useIntl()
  const { rows, isFetching } = useRows()
  const apiRef = useGridApiRef()

  const columns = useMemo<GridColDef<Row>[]>(() => {
    return [
      {
        field: 'name',
        headerName: t(messages.name),
        renderCell: NameColumn,
        sortable: false,
        flex: 1
      },
      {
        field: 'createdAt',
        headerName: t(messages.created),
        valueGetter: (_, row) => row?.actionSet.createdAt,
        renderCell: DateColumn,
        sortable: false,
        width: 200
      },
      {
        field: 'finalizedAt',
        headerName: t(messages.finalizedAt),
        valueGetter: (_, row) => row?.actionSet.finalizedAt,
        renderCell: DateColumn,
        sortable: false,
        width: 200
      },
      {
        field: 'user',
        headerName: t(messages.finalizedBy),
        valueGetter: (_, row) => row?.user?.name,
        sortable: true,
        width: 200
      },
      {
        field: 'overdueDays',
        headerName: t(messages.dateOverdue),
        valueGetter: (_, row) => dayjs(row.actionSet.finalizedAt).add(row.actionSet.overdueDays ?? 0, 'days'),
        renderCell: DateColumn,
        sortable: false,
        width: 200
      },
      {
        headerName: t(messages.file),
        field: 'actionSet.id',
        sortable: false,
        renderCell: ActionColumn,
        minWidth: 140,
        width: 200
      }
    ]
  }, [t])

  const getRowId = useCallback(({ actionSet }: Row) => actionSet.id, [])

  return (
    <Box
      sx={() => ({
        height: `calc(60vh)`
      })}
    >
      <Typography fontSize={16} mt={3} paddingBottom={2}>
        <FormattedMessage {...messages.plansDescription} />
      </Typography>
      {Boolean(rows.length) && (
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
            <FormattedMessage {...messages.emptyPlanList} />
          </ErrorMessage>
        </Box>
      )}
    </Box>
  )
}
