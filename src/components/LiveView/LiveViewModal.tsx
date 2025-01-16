import type { Row } from './useRows'
import type { Category, Store } from '@/api/types.generated'
import type { DataGridProProps, GridCellParams, GridFilterModel } from '@mui/x-data-grid-pro'
import { useEffect, useMemo } from 'react'
import { random } from '@arteli/utils'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { GridLogicOperator, useGridApiRef } from '@mui/x-data-grid-pro'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import api from '@/api'
import CollapseSection from '@/components/CollapseSection'
import { DataGrid } from '@/components/DataGrid/DataGrid'
import Modal from '@/components/Modal'
import { useExpansion } from '@/hooks/useExpansion'
import { unique } from '@/utils'
import { GridContext } from './GridContext'
import { useGridConfiguration } from './useGridConfiguration'
import { useGridContextValue } from './useGridContextValue'
import { useRows } from './useRows'

type LiveViewModalProps = {
  storeId: Store['id']
  open: boolean
  onClose: () => void
}

const slotPropsProperty = {
  loadingOverlay: {
    variant: 'skeleton',
    noRowsVariant: 'skeleton'
  }
} as DataGridProProps['slotProps']

const messages = defineMessages({
  title: { defaultMessage: 'Live View', id: 'o0sR6p' },
  description: {
    defaultMessage: 'This list consists of all the existing series and products that are currently on the floor.',
    id: 'HHerTo'
  },
  noRowsToShow: { defaultMessage: 'No Rows To Show', id: '+zndIf' },
  loading: { defaultMessage: 'Loading...', id: 'gjBiyj' }
})

const useAllStores = api.Arteli.Stores.findAll.asQuery()

const getCellClassName = ({ rowNode }: GridCellParams<Row>) => {
  if (rowNode.type == 'group' && rowNode.depth === 0) return 'group-cell'

  return ''
}

const getTreeDataPath = (row: Row) => row.path

export const LiveViewModal: React.FC<LiveViewModalProps> = ({ storeId, open, onClose }) => {
  const { data: stores } = useAllStores({ params: { ids: [storeId] } })
  const { rows, isFetching } = useRows({ storeIds: [storeId] })
  const gridApiRef = useGridApiRef()
  const contextValue = useGridContextValue(rows)
  const { columns, groupingColDef } = useGridConfiguration({ context: contextValue })
  const { selectedCategoryExternalIds, setCategoryExternalIds } = contextValue
  const { formatMessage: t } = useIntl()
  const { collapseAll, expandAll, isGroupExpandedByDefault } = useExpansion(gridApiRef)

  const filterModel = useMemo<GridFilterModel>(() => {
    const categoryIds =
      selectedCategoryExternalIds.length > 0 ? selectedCategoryExternalIds : [random.String as Category['externalId']]

    return {
      items: [{ id: random.String, field: 'category', operator: 'isAnyOf', value: categoryIds }],
      logicOperator: GridLogicOperator.And
    }
  }, [selectedCategoryExternalIds])

  useEffect(() => {
    setCategoryExternalIds(unique(rows.map(({ category }) => category.externalId)))
  }, [rows, setCategoryExternalIds])

  const localeText = useMemo(
    () => ({
      noRowsLabel: t(messages.noRowsToShow)
    }),
    [t]
  )

  return (
    <Modal
      title={<FormattedMessage {...messages.title} />}
      description={<FormattedMessage {...messages.description} />}
      open={open}
      onClose={onClose}
      size="xxLarge"
    >
      {stores?.length && (
        <Typography fontWeight="bold" mb={1}>
          {stores[0].externalId + ' ' + stores[0].name}
        </Typography>
      )}
      <CollapseSection onExpand={expandAll} onCollapse={collapseAll} disabled={isFetching} />
      <Box sx={{ height: 'calc(55vh)', mt: 2 }}>
        <GridContext.Provider value={contextValue}>
          <DataGrid
            disableColumnFilter
            apiRef={gridApiRef}
            treeData
            getTreeDataPath={getTreeDataPath}
            rows={rows}
            columns={columns}
            groupingColDef={groupingColDef}
            filterModel={filterModel}
            rowSelection={false}
            getCellClassName={getCellClassName}
            slotProps={slotPropsProperty}
            localeText={localeText}
            loading={isFetching}
            isGroupExpandedByDefault={isGroupExpandedByDefault}
          />
        </GridContext.Provider>
      </Box>
    </Modal>
  )
}
