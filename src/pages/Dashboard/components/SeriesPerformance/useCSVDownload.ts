import type { ActionStorePerf } from '@/api/types.generated'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import downloadFile from '@/utils/downloadFiles'
import { dateRange } from './dateRange'
import { labels } from './labels'

const exportValue = (rawValue: unknown) => JSON.stringify(rawValue, (_, value) => (value === null ? '' : value))

export const useCSVDownload = (showRemoved: boolean) => {
  const { formatNumber, formatDate, formatMessage: t } = useIntl()
  const { headers } = useCommonLabels()
  const { from, to } = dateRange.use()

  return useMemo(() => {
    const header = [
      t(labels.storeId),
      headers.Category,
      t(labels.seriesAdded),
      t(labels.dateAddedToFloor),
      t(labels.grossSalesAddedForSeries),
      t(labels.arteliPredictedSales),
      ...[showRemoved ? [t(labels.seriesRemoved), t(labels.predictedRemovalSales)] : []],
      t(labels.swapOrigin)
    ]

    return {
      download(items: ActionStorePerf[]) {
        const rows = items.map(
          ({
            storeExternalId,
            addedCategoryName,
            addedGroupName,
            addedDate,
            salesSum,
            addedPredictedSales,
            removedGroupName,
            removedPredictedSales,
            isManual
          }: ActionStorePerf) =>
            [
              storeExternalId,
              addedCategoryName,
              addedGroupName,
              formatDate(addedDate),
              formatNumber(salesSum, { currency: 'USD', style: 'currency' }),
              formatNumber(addedPredictedSales, { currency: 'USD', style: 'currency' }),
              ...(showRemoved
                ? [
                    removedGroupName,
                    removedPredictedSales
                      ? formatNumber(removedPredictedSales, { currency: 'USD', style: 'currency' })
                      : ''
                  ]
                : []),
              t(isManual ? labels.manual : labels.arteli)
            ]
              .map(exportValue)
              .join(',')
        )

        const csv = [header.join(','), ...rows].join('\r\n')

        downloadFile(csv, `series_performance_${from.format('YYYY-MM-DD')}_${to.format('YYYY-MM-DD')}.csv`, 'text/csv')
      }
    }
  }, [t, headers.Category, showRemoved, from, to, formatDate, formatNumber])
}
