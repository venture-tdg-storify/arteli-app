import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { getSentryEnv } from '@arteli/utils/src/getSentryEnv'
import { UserCreateRoles } from '$/api/types.generated'
import { useMe } from '@/hooks/useMe'
import { PresentationContext, type IPresentationItem } from './usePresentation'

const notProduction = getSentryEnv(location.host) !== 'Production'

export const PresentationProvider = ({ children }: { children: ReactNode }) => {
  const me = useMe()
  const isStaff = Boolean(me?.user.roles & UserCreateRoles.Staff)
  const [items, setItems] = useState<IPresentationItem[]>([] as IPresentationItem[])

  const isPresentation = notProduction && isStaff

  const setItem = useCallback(
    (newItem: IPresentationItem) => {
      setItems(
        items.find(({ id }) => id === newItem.id)
          ? items.map((item) => (item.id === newItem.id ? newItem : item))
          : [...items, newItem]
      )
    },
    [items]
  )

  const resetItem = useCallback(
    (id: IPresentationItem['id']) => {
      setItems(items.filter((item) => item.id !== id))
    },
    [items]
  )

  const resetAll = () => {
    setItems([])
  }

  const value = useMemo(
    () => ({ items, setItem, resetItem, resetAll, isPresentation }),
    [items, setItem, resetItem, isPresentation]
  )

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>
}
