import type { CategoryPerfRow } from './useRows'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import downloadFile from '@/utils/downloadFiles'
import { dateRange } from './dateRange'
import { labels } from './labels'

const exportValue = (rawValue: unknown) => JSON.stringify(rawValue, (_, value) => (value === null ? '' : value))

export const usePerformanceCSVDownload = () => {
  const { formatNumber, formatMessage: t } = useIntl()
  const { headers } = useCommonLabels()
  const { from, to } = dateRange.use()

  return useMemo(() => {
    const header = [headers.Category, t(labels.arteli), t(labels.existingSeries), t(labels.newSeries)]

    return {
      download(items: CategoryPerfRow[]) {
        const rows = items.map(
          ({ categoryName, arteliAvgPerStore, manualAvgPerStore, newGroupAvgPerStore }: CategoryPerfRow) =>
            [
              categoryName,
              formatNumber(arteliAvgPerStore, { currency: 'USD', style: 'currency' }),
              formatNumber(manualAvgPerStore, { currency: 'USD', style: 'currency' }),
              formatNumber(newGroupAvgPerStore, { currency: 'USD', style: 'currency' })
            ]
              .map(exportValue)
              .join(',')
        )

        const csv = [header.join(','), ...rows].join('\r\n')

        downloadFile(csv, `Arteli_Performance_${from.format('YYYY-MM-DD')}_${to.format('YYYY-MM-DD')}.csv`, 'text/csv')
      }
    }
  }, [headers.Category, t, from, to, formatNumber])
}
