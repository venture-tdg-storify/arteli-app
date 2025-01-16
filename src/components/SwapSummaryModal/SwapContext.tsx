import type { Group, Store } from '@/api/arteli'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGroupQuery } from '@/hooks/arteli'
import { businessFilters } from '@/store/businessFilters'
import { getSwapImpact, useRows, type Row } from './useRows'
import { SwapContext } from './useSwap'

export const SwapItemsProvider = ({
  children,
  groupId,
  storeIds,
  includeRecentlyAddedGroups
}: {
  children: ReactNode
  groupId?: Group['id']
  storeIds: Store['id'][]
  includeRecentlyAddedGroups?: boolean
}) => {
  const initializedRef = useRef(false)
  const [items, setItems] = useState<Row[]>([] as Row[])
  const { rows, isFetching } = useRows({ groupId, storeIds, includeRecentlyAddedGroups })
  const { data: group } = useGroupQuery({ params: { id: groupId ?? '' }, enabled: groupId !== undefined })

  useEffect(() => {
    if (!rows?.length || initializedRef.current) {
      return
    }

    initializedRef.current = true
    setItems([...rows].sort((a, b) => getSwapImpact(b) - getSwapImpact(a)))
  }, [rows])

  useEffect(
    () =>
      businessFilters.subscribe(() => {
        initializedRef.current = false
      }),
    [rows]
  )

  const deleteStore = (id: Store['id']) => {
    setItems((prevItems) => prevItems.filter((item) => item.store.id !== id))
  }

  const deleteSeries = (storeId: Store['id'], groupId: Group['id']) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.store.id === storeId && item.group?.id === groupId
          ? {
              store: item.store,
              note: item.note,
              addRecGroupPredictedSales: item.addRecGroupPredictedSales,
              clearance: item.clearance
            }
          : item
      )
    )
  }

  const setNote = (id: Store['id'], note: string) => {
    setItems((prevItems) => prevItems.map((item) => (item.store.id === id ? { ...item, note } : item)))
  }

  const replaceItem = (id: Store['id'], newItem: Row) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.store.id === id
          ? { ...newItem, note: item.note, addRecGroupPredictedSales: item.addRecGroupPredictedSales }
          : item
      )
    )
  }

  const value = useMemo(
    () => ({
      items,
      replaceItem,
      deleteStore,
      deleteSeries,
      setNote,
      isFetching,
      group,
      includeRecentlyAddedGroups
    }),
    [items, isFetching, group, includeRecentlyAddedGroups]
  )

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>
}
