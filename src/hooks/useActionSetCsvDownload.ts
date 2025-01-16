import type { ActionSet, ActionType } from '@/api/arteli'
import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { defineMessages, useIntl } from 'react-intl'
import { useCommonLabels } from '@/hooks/useCommonLabels'
import downloadFile from '@/utils/downloadFiles'
import { commonMessages } from '@/utils/messages'

const messages = defineMessages({
  removal: { defaultMessage: 'Removal', id: 'sL9UuY' }
})

const exportValue = (rawValue: unknown) => JSON.stringify(rawValue, (_, value) => (value === null ? '' : value))

export const useActionSetCsvDownload = () => {
  const { formatMessage: t, formatDate } = useIntl()
  const { headers } = useCommonLabels()

  const actions: Record<ActionType, string> = useMemo(
    () => ({ Add: t(commonMessages.add), Remove: t(commonMessages.remove) }),
    [t]
  )

  const getHeader = useCallback(
    (header: string, actionType: ActionType) =>
      header + ' (' + t(actionType === 'Add' ? commonMessages.add : messages.removal) + ')',
    [t]
  )

  return useMemo(
    () => ({
      download(items: ActionStoreRow[], actionSet: ActionSet) {
        const isFinalized = actionSet.status === 'Finalized'

        const header = [
          headers.Store,
          getHeader(headers.Action, 'Add'),
          getHeader(headers.Series, 'Add'),
          getHeader(headers.Category, 'Add'),
          getHeader(headers.Subcategory, 'Add'),
          getHeader(headers.Action, 'Remove'),
          getHeader(headers.Series, 'Remove'),
          getHeader(headers.Category, 'Remove'),
          getHeader(headers.Subcategory, 'Remove'),
          ...(isFinalized ? [t(commonMessages.executionDueDate)] : []),
          headers.Notes
        ]

        const rows = items
          .filter((item) => item.actionStore.actionType === 'Add')
          .map((item) => {
            const dependantActionStoreRow = item.actionStore.dependentId
              ? items.find(({ actionStore }) => actionStore.id === item.actionStore.dependentId)
              : null

            return [
              item.store.externalId + ' ' + item.store.name,
              actions[item.actionStore.actionType],
              item.group.name,
              item.category.externalId,
              item.subcategory?.name || '',
              dependantActionStoreRow ? actions[dependantActionStoreRow.actionStore.actionType] : '',
              dependantActionStoreRow?.group.name || '',
              dependantActionStoreRow?.category.externalId || '',
              dependantActionStoreRow?.subcategory?.name || '',
              ...(isFinalized && actionSet.overdueDays
                ? [formatDate(dayjs(actionSet.finalizedAt).add(actionSet.overdueDays, 'days').toISOString())]
                : []),
              item.actionStore.note ?? ''
            ]
              .map(exportValue)
              .join(',')
          })

        const csv = [header.join(','), ...rows].join('\r\n')
        downloadFile(csv, `${actionSet.name}.csv`, 'text/csv')
      }
    }),
    [actions, headers, t, formatDate, getHeader]
  )
}
