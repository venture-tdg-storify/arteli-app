import type { Charts } from '../useRows'
import type { SeriesValueFormatter } from '@mui/x-charts/internals'
import { useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid'
import { useIntl } from 'react-intl'
import { labels } from '../labels'

export const Chart = ({ charts, selected }: { charts: Charts; selected?: string | null }) => {
  const { formatDate, formatNumber } = useIntl()
  const { palette } = useTheme()
  const { formatMessage: t } = useIntl()

  const formatMaybeNumber = useCallback(
    (value: number | null) => {
      return Number.isNaN(value) || value === null
        ? 'N/A'
        : formatNumber(value / 1000, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) + 'k'
    },
    [formatNumber]
  )

  const valueFormatter: SeriesValueFormatter<number | null> = useCallback(
    (value) => formatMaybeNumber(value),
    [formatMaybeNumber]
  )

  return (
    <BarChart
      dataset={charts}
      margin={{ left: 96, right: 24, top: 24, bottom: 72 }}
      borderRadius={4}
      slotProps={{
        legend: {
          position: { horizontal: 'middle', vertical: 'bottom' }
        }
      }}
      sx={{
        [`& .${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translateX(-40px)'
        },
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 }
      }}
      xAxis={[
        {
          id: 'Month',
          dataKey: 'month',
          scaleType: 'band',
          valueFormatter: (date, { location }) => {
            if (location === 'tooltip') {
              const entry = charts.find((chart) => chart.month === date)
              const sum = entry ? entry?.manualSales + entry?.arteliSales + entry?.newGroupSales : null

              return formatDate(date, { month: 'short', timeZone: 'UTC' }) + ' ' + formatMaybeNumber(sum)
            }

            return formatDate(date, { month: 'short', timeZone: 'UTC' })
          },
          disableTicks: true
        }
      ]}
      yAxis={[
        {
          id: 'Sales',
          label: 'Revenue',
          valueFormatter: (value) => formatMaybeNumber(value),
          disableTicks: true
        }
      ]}
      series={[
        {
          id: 'Arteli',
          label: t(labels.arteli),
          dataKey: 'arteliSales',
          color: !selected || selected === 'arteliAvgPerStore' ? `#4543ec` : palette.grey[400],
          valueFormatter: formatMaybeNumber,
          stack: '1'
        },
        {
          id: 'Swaps',
          label: t(labels.existingSeries),
          dataKey: 'manualSales',
          color: !selected || selected === 'manualAvgPerStore' ? `#d1f5fe` : palette.grey[400],
          valueFormatter: formatMaybeNumber,
          stack: '1'
        },
        {
          id: 'New',
          label: t(labels.newSeries),
          dataKey: 'newGroupSales',
          color: !selected || selected === 'newGroupAvgPerStore' ? ` #daf87e` : palette.grey[400],
          valueFormatter: valueFormatter,
          stack: '1'
        }
      ]}
      resolveSizeBeforeRender
      height={300}
    />
  )
}
