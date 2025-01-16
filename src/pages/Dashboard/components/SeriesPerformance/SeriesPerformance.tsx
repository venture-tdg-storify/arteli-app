import type { OutletContext } from '../OutletContext'
import type { Category, Store, Subcategory } from '@/api/types.generated'
import type { GridFilterModel } from '@mui/x-data-grid-pro'
import type { Dayjs } from 'dayjs'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { random } from '@arteli/utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { GridLogicOperator, useGridApiRef } from '@mui/x-data-grid-pro'
import dayjs from 'dayjs'
import { createPortal } from 'react-dom'
import { defineMessages, FormattedMessage, FormattedRelativeTime, useIntl } from 'react-intl'
import { Outlet, useOutletContext } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import { DataGrid } from '@/components/DataGrid'
import ErrorMessage from '@/components/ErrorMessage'
import { useTenantSettings } from '@/hooks/useTenantSettings'
import { unique } from '@/utils'
import { formatTimeAgo } from '@/utils/formatTimeAgo'
import { DateRangePicker } from '../DateRangePicker'
import { PerfReportSelect } from '../PerfReportSelect'
import { DownloadAction } from './components/DownloadAction'
import { PerformanceFilters } from './components/PerformanceFilters'
import { dateRange } from './dateRange'
import { GridContext, type SwapOriginType } from './GridContext'
import { labels } from './labels'
import { useFilters } from './useFilters'
import { useGridConfiguration } from './useGridConfiguration'
import { useGridContextValue } from './useGridContextValue'
import { useRows } from './useRows'

const NullComponent = () => null

const slotsProperty = {
  footer: NullComponent
}

const messages = defineMessages({
  tableHeading: { defaultMessage: 'Average Sales Per Series Per Store Per Day', id: 'fY6UBv' },
  tableDescription: { defaultMessage: 'Measurement of swaps performance by category', id: 'dIfwt6' },
  chartHeading: { defaultMessage: 'Sales Impact', id: 'ZIcNoN' },
  chartDescription: { defaultMessage: 'Measurement of sales impact of in-store swaps', id: 'qjWd53' },
  emptyList: { defaultMessage: 'No swaps were executed yet for the selected Plan.', id: '250jLo' },
  downloadReport: { defaultMessage: 'Download Report', id: 'iHdvdj' },
  reportLastGenerated: { defaultMessage: 'Report last generated', id: 'xj3c+e' },
  generateReportError: { defaultMessage: 'Report has not been generated', id: 'iL3StU' },
  generateReport: { defaultMessage: 'Generate Report', id: '5I7Jzl' },
  performanceDescription: {
    defaultMessage: 'View sales performance for each series on the floor from the approved plans.',
    id: 's9bn9r'
  }
})

export function SeriesPerformance() {
  const { buttonContainerRef } = useOutletContext<OutletContext>()
  const apiRef = useGridApiRef()
  const filters = useFilters()
  const { generatedAt, from, to, minDate } = dateRange.use()
  const { columns } = useGridConfiguration()
  const { data: tenantSettings } = useTenantSettings()
  const contextValue = useGridContextValue()
  const { formatMessage: t } = useIntl()

  const { selectedOrigin, setOrigin } = contextValue

  const { rows, isFetching, refetch } = useRows({ filters })

  const filteredColumns = useMemo(
    () =>
      columns.filter(({ field }) => {
        const show = tenantSettings?.uiConfig.selectWebApp?.seriesPerformanceReportUI?.showRemoved ?? false
        if (field === 'removedGroupName' || field === 'removedPredictedSales') return show
        return true
      }),
    [columns, tenantSettings]
  )

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

  const handleChangeCategory = useCallback(
    ({ categoryId, subcategoryIds }: { categoryId: Category['id'] | null; subcategoryIds: Subcategory['id'][] }) => {
      filters.changeCategory({ categoryId, subcategoryIds })
      dateRange.set('generatedAt', null)
    },
    [filters]
  )

  const handleChangeStore = useCallback(
    (storeIds: Store['id'][]) => {
      filters.changeStore(storeIds)
      dateRange.set('generatedAt', null)
    },
    [filters]
  )

  useEffect(() => {
    setOrigin(unique(rows.map(({ isManual }) => t(isManual ? labels.manual : labels.arteli) as SwapOriginType)))
  }, [rows, setOrigin, t])

  const filterModel = useMemo<GridFilterModel>(() => {
    const swapOrigin = selectedOrigin.length > 0 ? selectedOrigin : [random.String as SwapOriginType]

    return {
      items: [{ id: random.String, field: 'isManual', operator: 'isAnyOf', value: swapOrigin }],
      logicOperator: GridLogicOperator.And
    }
  }, [selectedOrigin])

  const isGenerated = Boolean(generatedAt)
  const hasData = !isFetching && rows?.length > 0

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
        <Stack mt={1} mb={3}>
          <Stack alignItems="center" justifyContent="start" spacing={2} direction="row">
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
              disabled={isGenerated || filters.categoryId === null}
            >
              <FormattedMessage {...messages.generateReport} />
            </Button>
          </Stack>
          {isGenerated && (
            <DownloadAction
              disabled={isFetching}
              rows={rows}
              showRemoved={tenantSettings?.uiConfig.selectWebApp?.seriesPerformanceReportUI?.showRemoved ?? false}
            />
          )}
        </Stack>
        <PerformanceFilters
          categoryId={filters.categoryId}
          subcategoryIds={filters.subcategoryIds}
          storeIds={filters.storeIds}
          changeCategory={handleChangeCategory}
          changeStore={handleChangeStore}
        />
        {Boolean(rows.length) && isGenerated && (
          <GridContext.Provider value={contextValue}>
            <Box sx={{ height: 'calc(55vh)' }}>
              <DataGrid
                rowSelection={false}
                apiRef={apiRef}
                rows={rows}
                columns={filteredColumns}
                slots={slotsProperty}
                filterModel={filterModel}
                disableColumnFilter
              />
            </Box>
          </GridContext.Provider>
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
