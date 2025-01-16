import type { CategoryPerfRow } from './useRows'
import type { OutletContext } from '../OutletContext'
import type { Category } from '@/api/types.generated'
import type { DataGridProProps, GridRowSelectionModel } from '@mui/x-data-grid-pro'
import type { Dayjs } from 'dayjs'
import type { SetStateAction } from 'react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useGridApiRef } from '@mui/x-data-grid-pro'
import dayjs from 'dayjs'
import { createPortal } from 'react-dom'
import { FormattedMessage, FormattedRelativeTime, defineMessages } from 'react-intl'
import { Outlet, useOutletContext } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import { DataGrid } from '@/components/DataGrid/DataGrid'
import ErrorMessage from '@/components/ErrorMessage'
import { formatTimeAgo } from '@/utils/formatTimeAgo'
import { DateRangePicker } from '../DateRangePicker'
import { PerfReportSelect } from '../PerfReportSelect'
import { Chart } from './components/Chart'
import { DownloadAction } from './components/DownloadAction'
import { dateRange } from './dateRange'
import { useGridConfiguration } from './useGridConfiguration'
import { useRows } from './useRows'

const messages = defineMessages({
  tableHeading: { defaultMessage: 'Average Sales Per Series Per Store Per Day', id: 'fY6UBv' },
  tableDescription: { defaultMessage: 'Measurement of swaps performance by category', id: 'dIfwt6' },
  chartHeading: { defaultMessage: 'Sales Impact', id: 'ZIcNoN' },
  chartDescription: { defaultMessage: 'Measurement of sales impact of in-store swaps', id: 'qjWd53' },
  performanceDescription: {
    defaultMessage: 'View sales performance of added series from the approved plans.',
    id: 'DA8AkV'
  },
  emptyList: { defaultMessage: 'No swaps were executed yet for the selected Plan.', id: '250jLo' },
  downloadReport: { defaultMessage: 'Download Report', id: 'iHdvdj' },
  reportLastGenerated: { defaultMessage: 'Report last generated', id: 'xj3c+e' },
  generateReportError: { defaultMessage: 'Report has not been generated', id: 'iL3StU' },
  generateReport: { defaultMessage: 'Generate Report', id: '5I7Jzl' }
})

const sx = {
  '& .MuiDataGrid-row': {
    cursor: 'pointer'
  },
  '& .MuiDataGrid-columnHeaderTitleContainerContent': {
    width: 'unset'
  },
  '.performance-header .MuiDataGrid-columnHeaderTitleContainerContent': {
    width: '100%'
  }
} as DataGridProProps['sx']

export function Performance() {
  const apiRef = useGridApiRef()
  const { generatedAt, from, to, minDate } = dateRange.use()
  const { columns } = useGridConfiguration()
  const [selectedCategory, setSelectedCategory] = useState<GridRowSelectionModel>([])
  const { buttonContainerRef } = useOutletContext<OutletContext>()

  const { rows, isFetching, refetch, charts } = useRows({
    selectedCategory: selectedCategory as Category['name'][]
  })

  const getRowId = useCallback(({ categoryName }: CategoryPerfRow) => categoryName, [])

  const handleGenerateReport = useCallback(() => {
    dateRange.set('generatedAt', dayjs())
    setTimeout(refetch, 0)
  }, [refetch])

  const handleFromChange = useCallback(
    (newFrom: Dayjs | null) => {
      if (null === newFrom || newFrom.isSame(from, 'day')) return

      dateRange.set('from', newFrom)
      dateRange.set('generatedAt', null)
    },
    [from]
  )

  const handleToChange = useCallback(
    (newTo: Dayjs | null) => {
      if (null === newTo || newTo.isSame(to, 'day')) return

      dateRange.set('to', newTo)
      dateRange.set('generatedAt', null)
    },
    [to]
  )

  const isGenerated = Boolean(generatedAt)
  const hasData = !isFetching && rows?.length > 0

  useEffect(() => {
    if (isGenerated) return

    dateRange.set('generatedAt', dayjs())
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (apiRef && rows.length > 0) {
      apiRef.current?.selectRows(rows.map(({ categoryName }) => categoryName))
    }
  }, [apiRef, rows])

  const handleRowSelectionModelChange = useCallback((newRowSelectionModel: SetStateAction<GridRowSelectionModel>) => {
    setSelectedCategory(newRowSelectionModel)
  }, [])

  return (
    <>
      {buttonContainerRef?.current && createPortal(<PerfReportSelect />, buttonContainerRef.current)}
      <Box
        sx={({ sizes }) => ({
          height: `calc(100vh - ${sizes.header.height}px - ${sizes.pageHeader.height}px - ${70}px)`
        })}
      >
        <Stack>
          <Typography fontSize={16} mt={3} mb={2}>
            <FormattedMessage {...messages.performanceDescription} />
          </Typography>
          <Stack spacing={1} sx={{ alignItems: 'center', ml: 1 }}>
            {isGenerated && hasData && <DownloadAction disabled={isFetching} rows={rows} />}
          </Stack>
        </Stack>
        <Stack alignItems="center" sx={{ mt: 1 }}>
          <DateRangePicker
            minDate={minDate}
            from={from}
            to={to}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
            disableFuture
          />
          <Button
            color="primary"
            variant="contained"
            onClick={handleGenerateReport}
            size="medium"
            sx={{ mr: 'auto', ml: 2 }}
            disabled={isGenerated}
          >
            <FormattedMessage {...messages.generateReport} />
          </Button>
        </Stack>

        {Boolean(rows.length) && isGenerated && (
          <>
            <Stack justifyContent="flex-end">
              {isGenerated && (
                <Typography fontSize={16} sx={{ color: 'text.secondary' }}>
                  <FormattedMessage {...messages.reportLastGenerated} />{' '}
                  <FormattedRelativeTime
                    {...formatTimeAgo(generatedAt!.toDate())}
                    numeric="auto"
                    updateIntervalInSeconds={10}
                    style="long"
                  />
                </Typography>
              )}
            </Stack>
            <Grid container spacing={4}>
              <Grid size={{ xs: 7 }}>
                <Typography fontWeight="bold" fontSize={16} mt={2}>
                  <FormattedMessage {...messages.tableHeading} />
                </Typography>
                <Typography mb={2}>
                  <FormattedMessage {...messages.tableDescription} />
                </Typography>
                <div>
                  <DataGrid
                    checkboxSelection
                    indeterminateCheckboxAction="select"
                    onRowSelectionModelChange={handleRowSelectionModelChange}
                    rowSelectionModel={selectedCategory}
                    apiRef={apiRef}
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    columnBufferPx={1280}
                    sx={sx}
                  />
                </div>
              </Grid>
              <Grid size={{ xs: 5 }}>
                <Typography fontWeight="bold" fontSize={16} mt={2}>
                  <FormattedMessage {...messages.chartHeading} />
                </Typography>
                <Typography mb={2}>
                  <FormattedMessage {...messages.chartDescription} />
                </Typography>
                {charts && <Chart charts={charts} />}
              </Grid>
            </Grid>
          </>
        )}

        {!isGenerated && (
          <Box sx={{ height: 240, position: 'relative' }}>
            <ErrorMessage>
              <FormattedMessage {...messages.generateReportError} />
            </ErrorMessage>
          </Box>
        )}

        {!isFetching && isGenerated && !hasData && (
          <Box sx={{ height: 240, position: 'relative' }}>
            <ErrorMessage>
              <FormattedMessage {...messages.emptyList} />
            </ErrorMessage>
          </Box>
        )}
      </Box>
      <TransitionGroup>
        <Suspense>
          <Outlet />
        </Suspense>
      </TransitionGroup>
    </>
  )
}
