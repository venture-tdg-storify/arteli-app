import type { Filters } from './useFilters'
import Stack from '@mui/material/Stack'
import StoresFilter from '@/components/StoresFilter'
import { PlanCategoryFilters } from './PlanCategoryFilters'

export const PlanFilters = ({ categoryId, subcategoryIds, changeCategory, changeStore, storeIds }: Filters) => {
  return (
    <Stack spacing={3} pt={0} pb={0} alignItems="flex-start" justifyContent="flex-start">
      <PlanCategoryFilters categoryId={categoryId} subcategoryIds={subcategoryIds} onChange={changeCategory} />
      <StoresFilter onChange={changeStore} storeIds={storeIds} />
    </Stack>
  )
}
