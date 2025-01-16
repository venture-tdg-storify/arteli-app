import type { SwapOriginType } from './GridContext'
import { useMemo, useState } from 'react'

export const useGridContextValue = () => {
  const [origin, setOrigin] = useState<SwapOriginType[]>([])
  const [selectedOrigin, setSelectedOrigin] = useState<SwapOriginType[]>([])

  return useMemo(
    () => ({
      origin,
      setOrigin,
      selectedOrigin,
      setSelectedOrigin
    }),
    [origin, selectedOrigin]
  )
}
