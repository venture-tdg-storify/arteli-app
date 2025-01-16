import { createContext } from 'react'

export type SwapOriginType = 'Arteli' | 'Manually-entered'

export type GridContextParams = {
  origin: SwapOriginType[]
  setOrigin: (origin: SwapOriginType[]) => void
  selectedOrigin: SwapOriginType[]
  setSelectedOrigin: (origin: SwapOriginType[]) => void
}

export const GridContext = createContext<GridContextParams>({} as GridContextParams)
