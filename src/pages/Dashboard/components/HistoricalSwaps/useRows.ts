import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import { useEffect, useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import dayjs from 'dayjs'
import api from '@/api'
import { usePresentation } from '@/components/PresentationMenu/usePresentation'
import { useActionStoreRowsQuery } from '@/hooks/useActionStoreRowsQuery'
import { useDateRange } from '@/pages/Dashboard/useDateRange'
import { allItemsQuery } from '@/utils/allItemsQuery'

const useAllActionSets = allItemsQuery(api.Arteli.ActionSets.findAll)

export const useRows = () => {
  const { from, to, setFrom, setTo } = useDateRange()
  const { items } = usePresentation()

  const { data: actionSets, isFetching: isFetchingActionSets } = useAllActionSets()

  const initial = useMemo(() => (actionSets ?? []).find(({ status }) => status === 'Finalized'), [actionSets])

  useEffect(() => {
    setFrom(dayjs(initial?.createdAt))
    setTo(dayjs(initial?.finalizedAt).endOf('day'))
  }, [initial, setFrom, setTo])

  const { data: actionStores, isFetching: isFetchingActionStores } = useActionStoreRowsQuery({
    params: { setFinalizedAtFrom: from?.toISOString(), setFinalizedAtTo: to?.toISOString() },
    enabled: Boolean(from) && Boolean(to)
  })

  const [rows, setRows] = useState<ActionStoreRow[]>([])
  const isFetching = isFetchingActionStores || isFetchingActionSets

  useEffect(() => {
    if (isFetching || !actionStores || !actionSets) {
      return
    }

    const actionSetsById = groupById(actionSets)

    setRows(
      actionStores.map((store) => {
        const actionSet = actionSetsById[store.actionStore.setId]

        if (items.length > 0) {
          const item = items.find((item) => item.id === store.actionStore.id)
          return item
            ? {
                ...store,
                status: item.status,
                overdueDate: item.overdueDate,
                actionStore: {
                  ...store.actionStore,
                  completionStatus: item.completionStatus,
                  completionDate: item.completionDate
                }
              }
            : store
        }

        return {
          ...store,
          overdueDate:
            actionSet && actionSet.overdueDays
              ? dayjs(actionSet.finalizedAt).add(actionSet.overdueDays, 'days').toISOString()
              : null
        }
      })
    )
  }, [actionStores, isFetching, actionSets, items])

  return { rows, isFetching }
}
