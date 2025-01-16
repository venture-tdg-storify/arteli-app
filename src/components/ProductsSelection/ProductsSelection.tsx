import type { Row } from './useRows'
import type { Product } from '@/api/arteli'
import { useCallback, useState, type SetStateAction } from 'react'
import { type GridSortModel, useGridApiRef, type GridRowSelectionModel } from '@mui/x-data-grid-pro'
import { DataGrid } from '@/components/DataGrid'
import { useGridConfiguration } from './useGridConfiguration'

const getRowId = ({ product }: Row) => product.id

export const ProductSelection = <DataFetcherProps,>({
  value,
  onChange,
  dataFetcher,
  ...props
}: {
  value: Product['id'][]
  onChange: (productIds: readonly Product['id'][]) => void
  dataFetcher: (props: DataFetcherProps) => { rows: Row[]; isFetching: boolean }
} & DataFetcherProps) => {
  const gridApiRef = useGridApiRef()
  const { columns } = useGridConfiguration()
  const { rows, isFetching } = dataFetcher(props as DataFetcherProps)

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'predictedSales',
      sort: 'desc'
    }
  ])

  const handleRowSelectionModelChange = useCallback(
    (newRowSelectionModel: SetStateAction<GridRowSelectionModel>) => {
      onChange(newRowSelectionModel as Product['id'][])
    },
    [onChange]
  )

  return (
    <DataGrid
      checkboxSelection
      indeterminateCheckboxAction="select"
      onRowSelectionModelChange={handleRowSelectionModelChange}
      rowSelectionModel={value as GridRowSelectionModel}
      apiRef={gridApiRef}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      columnBufferPx={1280}
      loading={isFetching}
      sortModel={sortModel}
      onSortModelChange={(model) => setSortModel(model)}
    />
  )
}
