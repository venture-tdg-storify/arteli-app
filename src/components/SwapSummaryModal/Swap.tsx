import type { Row } from './useRows'
import type { Product } from '@/api/arteli'
import type { DataGridProProps, GridCellParams } from '@mui/x-data-grid-pro'
import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useGridApiRef } from '@mui/x-data-grid-pro'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { useMatch, useNavigate } from 'react-router-dom'
import api from '@/api'
import { ActionStoreCreateFlags } from '@/api/arteli'
import { ProductSelection } from '@/components/ProductsSelection'
import { useRows } from '@/components/ProductsSelection/useRows'
import { useExpansion } from '@/hooks/useExpansion'
import { useFilterFlags, useFilters } from '@/hooks/useFilters'
import { PATH_ACTIVE_ACTION_SET, PATH_SWAP } from '@/routes'
import { toast } from '@/store/notifications'
import analytics from '@/utils/analytics'
import { commonMessages } from '@/utils/messages'
import { DataGrid } from '../DataGrid/DataGrid'
import ErrorMessage from '../ErrorMessage'
import { Header } from './components/Header'
import { SwapCreatedModal } from './components/SwapCreatedModal'
import { GridContext } from './GridContext'
import { useGridConfiguration } from './useGridConfiguration'
import { useGridContextValue } from './useGridContextValue'
import { useSwap } from './useSwap'

const slotPropsProperty = {
  loadingOverlay: {
    variant: 'linear-progress',
    noRowsVariant: 'linear-progress'
  }
} as DataGridProProps['slotProps']

const useAddActionStoreMultiMutation = api.Arteli.ActionStores.addMulti.asMutation()

const messages = defineMessages({
  approve: { defaultMessage: 'Approve All Swaps', id: 'PI1oZ5' },
  close: { defaultMessage: 'Close', id: 'rbrahO' },
  noRowsToShow: { defaultMessage: 'No Rows To Show', id: '+zndIf' },
  loading: { defaultMessage: 'Loading...', id: 'gjBiyj' },
  description: {
    defaultMessage:
      'Would you like to remove the lowest performing series automatically from these stores when adding the new series?',
    id: '78nOqZ'
  },
  addOnly: { defaultMessage: 'Add Only', id: 'OR4UaI' },
  addRecs: { defaultMessage: 'Apply Remove Recommendations', id: 'c+HZzW' },
  empty: { defaultMessage: 'No Rows To Show', id: '+zndIf' }
})

const getTreeDataPath = ({ store, group }: Row) => [store.id, group?.id ?? 'N/A']

const getCellClassName = ({ rowNode }: GridCellParams<Row>) => {
  if (rowNode.type == 'group') return 'group-cell'
  return ''
}

export const Swap: React.FC = () => {
  const gridApiRef = useGridApiRef()
  const navigate = useNavigate()
  const [swapCreatedModal, setSwapCreatedModal] = useState(false)
  const queryClient = useQueryClient()
  const { formatMessage: t } = useIntl()
  const filters = useFilters()
  const { allSubcategoriesSelected } = useFilterFlags()
  const { items, group, isFetching } = useSwap()
  const fromPlan = Boolean(useMatch(PATH_ACTIVE_ACTION_SET + '/' + PATH_SWAP))
  const [count, setCount] = useState(0)
  const contextValue = useGridContextValue(items)
  const { isGroupExpandedByDefault, expandAll } = useExpansion(gridApiRef)
  const [productIds, setProductIds] = useState<Product['id'][]>([])
  const [expanded, setExpanded] = useState(false)

  const handleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  const { columns, groupingColDef } = useGridConfiguration({ context: contextValue })

  const { mutate: addActionStore, isPending } = useAddActionStoreMultiMutation({
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['action-sets', 'active'] })
      queryClient.invalidateQueries({ queryKey: ['action-stores'] })
      queryClient.invalidateQueries({ queryKey: ['rows', 'add-recs', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['rec-groups', 'Add'] })
      queryClient.invalidateQueries({ queryKey: ['rec-groups', 'Remove'] })
    },
    onSuccess: () => {
      setSwapCreatedModal(true)
    },
    onError: (error) => {
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const handleSubmit = useCallback(
    (withRecs = true) => {
      analytics?.track('Confirm button clicked')

      setCount(items.length)

      addActionStore({
        body: {
          actions: items.map((item) => ({
            categoryId: filters.categoryId!,
            subcategoryId: allSubcategoriesSelected ? null : filters.subcategoryIds[0],
            groupId: group!.id,
            storeId: item.store.id,
            actionType: 'Add',
            note: item.note.trim().length ? item.note.trim() : undefined,
            flags: fromPlan ? ActionStoreCreateFlags.Manual : undefined,
            swap: withRecs
              ? item.filters
                ? {
                    categoryId: item.filters.categoryId!,
                    subcategoryId: item.filters.subcategoryId,
                    groupId: item.group!.id
                  }
                : null
              : null,
            productIds
          }))
        }
      })
    },
    [
      items,
      addActionStore,
      filters.categoryId,
      filters.subcategoryIds,
      allSubcategoriesSelected,
      group,
      fromPlan,
      productIds
    ]
  )

  const handleClose = useCallback(() => {
    setSwapCreatedModal(false)
    navigate('..')
  }, [navigate])

  const getRowId = useCallback(({ store }: Row) => store.id, [])

  const isCalledRef = useRef(false)

  useEffect(() => {
    if (isCalledRef.current || !items.length) return

    isCalledRef.current = true

    expandAll()
  }, [expandAll, items])

  const handleChangeProducts = useCallback((productIds: readonly Product['id'][]) => {
    setProductIds([...productIds])
  }, [])

  if (!group) return null

  return (
    <>
      <Header
        expanded={expanded}
        handleExpand={handleExpand}
        group={group}
        noOfStores={items.length}
        predictedSales={items.reduce((acc, item) => acc + (item.addRecGroupPredictedSales ?? 0), 0)}
        isMulti={filters.storeIds.length > 1}
      >
        <Box sx={{ width: '100%', height: 'calc(100% - 54px)' }}>
          <ProductSelection
            value={productIds}
            onChange={handleChangeProducts}
            categoryId={filters.categoryId!}
            subcategoryIds={filters.subcategoryIds}
            groupId={group.id}
            storeIds={items.map((item) => item.store.id)}
            dataFetcher={useRows}
          />
        </Box>
      </Header>
      <Box sx={{ my: 3, height: expanded ? 'calc(100vh - 540px)' : 'calc(100vh - 265px)' }}>
        <GridContext.Provider value={contextValue}>
          <DataGrid
            apiRef={gridApiRef}
            treeData
            getTreeDataPath={getTreeDataPath}
            getRowId={getRowId}
            rows={items}
            columns={columns}
            groupingColDef={groupingColDef}
            rowSelection={false}
            getCellClassName={getCellClassName}
            slotProps={slotPropsProperty}
            loading={isFetching || items.length === 0}
            isGroupExpandedByDefault={isGroupExpandedByDefault}
          />
        </GridContext.Provider>
        {!isFetching && items?.length === 0 && (
          <ErrorMessage>
            <FormattedMessage {...messages.empty} />
          </ErrorMessage>
        )}
      </Box>
      {fromPlan && (
        <Typography mb={3}>
          <FormattedMessage {...messages.description} />
        </Typography>
      )}
      <Stack direction="row" spacing={4} sx={{ width: '100%' }}>
        {fromPlan && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => handleSubmit(false)}
            disabled={isPending || items.length === 0}
          >
            <FormattedMessage {...messages.addOnly} />
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleSubmit(true)}
          disabled={isPending || items.length === 0}
        >
          <FormattedMessage {...(fromPlan ? messages.addRecs : messages.approve)} />
        </Button>
      </Stack>
      <SwapCreatedModal open={swapCreatedModal} count={count} onClose={handleClose} fromPlan={fromPlan} />
    </>
  )
}
