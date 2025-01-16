import type { GridApiPro, GridBasicGroupNode, GridGroupNode, GridRowId } from '@mui/x-data-grid-pro'
import type { MutableRefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { gridExpandedSortedRowIdsSelector, gridSortedRowIdsSelector, useGridApiContext } from '@mui/x-data-grid-pro'

export const useExpansion = (gridApiRef: MutableRefObject<GridApiPro>) => {
  const expandedRef = useRef<Record<GridRowId, boolean>>({})

  const setExpanded = useCallback((id: GridRowId, e: boolean) => {
    expandedRef.current[id] = e
  }, [])

  const isExpanded = useCallback((id: string) => {
    return expandedRef.current[id] ?? false
  }, [])

  const expandAll = useCallback(() => {
    const gridApi = gridApiRef?.current

    if (!gridApi) return

    gridSortedRowIdsSelector(gridApiRef)
      .map((id) => gridApi.getRowNode(id))
      .filter((node) => node?.type === 'group')
      .forEach((node) => !node.childrenExpanded && gridApi.setRowChildrenExpansion(node.id, true))
  }, [gridApiRef])

  const collapseAll = useCallback(() => {
    const gridApi = gridApiRef?.current

    if (!gridApi) return

    gridExpandedSortedRowIdsSelector(gridApiRef)
      .map((id) => gridApi.getRowNode(id))
      .filter((node) => node?.type === 'group')
      .forEach((node) => node.childrenExpanded && gridApi.setRowChildrenExpansion(node.id, false))
  }, [gridApiRef])

  useEffect(() => {
    const gridApi = gridApiRef?.current

    if (!gridApi) return

    return gridApi.subscribeEvent?.('rowExpansionChange', (node: GridBasicGroupNode) =>
      setExpanded(node.id.toString(), node.childrenExpanded ?? false)
    )
  })

  const isGroupExpandedByDefault = useCallback((node: GridGroupNode) => isExpanded(node.id.toString()), [isExpanded])

  return { expandedRef, isExpanded, setExpanded, expandAll, collapseAll, isGroupExpandedByDefault }
}

export const useExpansionClickHandler = <Element = HTMLButtonElement>({
  id,
  field,
  expanded
}: {
  id: GridRowId
  field: string
  expanded: boolean
}) => {
  const apiRef = useGridApiContext()

  return useCallback(
    (event: React.MouseEvent<Element>) => {
      apiRef.current.setRowChildrenExpansion(id, !expanded)
      apiRef.current.setCellFocus(id, field)
      event.stopPropagation()
    },
    [apiRef, expanded, field, id]
  )
}
