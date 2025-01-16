import type { Filters } from '../useFilters'
import Stack from '@mui/material/Stack'
import StoresFilter from '@/components/StoresFilter'
import { CategoryFilters } from './CategoryFilters'

export const PerformanceFilters = ({ categoryId, subcategoryIds, changeCategory, changeStore, storeIds }: Filters) => {
  return (
    <Stack spacing={3} pt={0} pb={0} alignItems="flex-start" justifyContent="flex-start">
      <CategoryFilters categoryId={categoryId} subcategoryIds={subcategoryIds} onChange={changeCategory} />
      <StoresFilter onChange={changeStore} storeIds={storeIds} />
    </Stack>
  )
}
