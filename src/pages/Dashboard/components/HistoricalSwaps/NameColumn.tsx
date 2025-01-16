import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useContext } from 'react'
import { ActionStoreNameColumn } from '@/components/grid/ActionStoreNameColumn'
import { GridContext } from './GridContext'

export function NameColumn({ id, field, rowNode, row }: GridRenderCellParams<ActionStoreRow>) {
  const { storesById, addActionsCountByStoreId, actionStoresById, groupsById } = useContext(GridContext)

  return (
    <ActionStoreNameColumn
      id={id}
      field={field}
      rowNode={rowNode}
      row={row}
      storesById={storesById}
      addActionsCountByStoreId={addActionsCountByStoreId}
      actionStoresById={actionStoresById}
      groupsById={groupsById}
    />
  )
}
