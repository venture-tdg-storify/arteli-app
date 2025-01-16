import type { Category, Store, Subcategory } from '@/api/arteli'
import { useCallback } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import CategoriesFilter from '@/components/CategoriesFilter'
import { LiveViewIcon } from '@/components/LiveView/components/LiveViewIcon'
import StoresFilter from '@/components/StoresFilter'
import { useFilters } from '@/hooks/useFilters'

export const RecommendationsFilters = () => {
  const { storeIds, categoryId, subcategoryIds, setParams } = useFilters()

  const handleChangeStoreIds = useCallback(
    (storeIds: Store['id'][]) => {
      setParams({ storeIds })
    },
    [setParams]
  )

  const handleChangeCategory = useCallback(
    ({ categoryId, subcategoryIds }: { categoryId: Category['id'] | null; subcategoryIds: Subcategory['id'][] }) => {
      setParams({ categoryId, subcategoryIds })
    },
    [setParams]
  )

  return (
    <Stack spacing={3} pt={0} pb={0} alignItems="flex-start" justifyContent="flex-start">
      <CategoriesFilter onChange={handleChangeCategory} categoryId={categoryId!} subcategoryIds={subcategoryIds} />
      <StoresFilter onChange={handleChangeStoreIds} storeIds={storeIds} />
      {storeIds.length == 1 && (
        <Box display="flex" height={40} alignItems="center">
          <LiveViewIcon storeId={storeIds[0]} />
        </Box>
      )}
    </Stack>
  )
}
