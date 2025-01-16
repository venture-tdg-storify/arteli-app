import type { Row } from '../../useRows'
import type { Group, Subgroup } from '@/api/types.generated'
import type { DataGridProProps, GridBasicGroupNode, GridCellParams } from '@mui/x-data-grid-pro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { GRID_TREE_DATA_GROUPING_FIELD, useGridApiRef } from '@mui/x-data-grid-pro'
import { FormattedMessage, defineMessages } from 'react-intl'
import { DataGrid } from '@/components/DataGrid/DataGrid'
import ErrorMessage from '@/components/ErrorMessage'
import GroupSearch from '@/components/GroupSearch'
import LoadMoreButton from '@/components/LoadMoreButton'
import { useExpansion } from '@/hooks/useExpansion'
import { useFilters } from '@/hooks/useFilters'
import { useRows } from '../../useRows'
import { useGridConfiguration } from './useGridConfiguration'

const SearchContainer = styled('div')(() => ({
  display: 'flex',
  alignContent: 'baseline',
  width: '33%',
  paddingRight: 1
}))

const Wrapper = styled('div')(({ hasNextPage, hasData }: { hasNextPage: boolean; hasData: boolean }) => ({
  height: hasData ? `calc(100% - ${hasNextPage ? '48px' : '0px'})` : '3px',
  opacity: hasData ? 1 : 0
}))

const messages = defineMessages({
  noRecommendationDataAvailable: { defaultMessage: 'No recommendation data available', id: 'mo1O85' }
})

const getThreeDataPath = function (row: Row) {
  return row.path
}

const getCellClassName = ({ colDef, row, rowNode }: GridCellParams<Row>) => {
  if (rowNode.type == 'group' && rowNode.depth === 0) return 'group-cell'

  if (row.rejections?.length > 0 && colDef.field === GRID_TREE_DATA_GROUPING_FIELD && row.type !== 'loading')
    return 'line-through'

  return ''
}

const sx = {
  '& .line-through': {
    textDecoration: 'line-through'
  }
} as DataGridProProps['sx']

export const RecommendationsList = () => {
  const gridApiRef = useGridApiRef()
  const [groupIds, setGroupIds] = useState<Group['id'][] | null>(null)
  const { columns, groupingColDef } = useGridConfiguration()
  const { rows, isFetching, loadSubgroupRowsByGroupId, loadProductRows } = useRows({ ids: groupIds })
  const [limit, setLimit] = useState(10)
  const { storeIds, categoryId, subcategoryIds } = useFilters()
  const { isGroupExpandedByDefault } = useExpansion(gridApiRef)

  useEffect(() => {
    setLimit(10)
  }, [storeIds, categoryId, subcategoryIds])

  const paginatedRows = useMemo(() => {
    const rowsUpToLimit = []
    let groupsFoundCnt = 0

    for (const row of rows) {
      if (row.type === 'group') {
        groupsFoundCnt++
      }

      if (groupsFoundCnt > limit) {
        break
      }

      rowsUpToLimit.push(row)
    }

    return rowsUpToLimit
  }, [rows, limit])

  const handleLoadMore = useCallback(() => {
    setLimit((prevLimit) => prevLimit + 10)
  }, [])

  const hasNextPage = paginatedRows.length < rows.length

  useEffect(
    () =>
      gridApiRef?.current?.subscribeEvent?.('rowExpansionChange', (node: GridBasicGroupNode) => {
        if (!node.groupingKey) return

        if (node.depth === 0) {
          loadSubgroupRowsByGroupId(node.groupingKey as Group['id'])
        }

        if (node.depth === 1) {
          const [groupId, subgroup] = (node.id as string).split('-')

          loadProductRows(groupId as Group['id'], subgroup as Subgroup['id'])
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridApiRef.current, loadSubgroupRowsByGroupId, loadProductRows]
  )

  return (
    <>
      <Stack justifyContent="flex-end">
        <SearchContainer>
          <GroupSearch onSetId={setGroupIds} isFetchingRecs={isFetching} />
        </SearchContainer>
      </Stack>

      {
        <Wrapper hasNextPage={hasNextPage} hasData={rows.length > 0}>
          <DataGrid
            rows={paginatedRows}
            apiRef={gridApiRef}
            treeData
            columns={columns}
            groupingColDef={groupingColDef}
            sx={sx}
            getTreeDataPath={getThreeDataPath}
            isGroupExpandedByDefault={isGroupExpandedByDefault}
            getCellClassName={getCellClassName}
            disableColumnSorting
            disableColumnFilter
            rowSelection={false}
          />
          <LoadMoreButton hasMore={hasNextPage} isFetching={isFetching} onLoadMore={handleLoadMore} />
        </Wrapper>
      }
      {!isFetching && rows?.length === 0 && (
        <Box sx={{ height: 300, position: 'relative' }}>
          <ErrorMessage>
            <FormattedMessage {...messages.noRecommendationDataAvailable} />
          </ErrorMessage>
        </Box>
      )}
    </>
  )
}
