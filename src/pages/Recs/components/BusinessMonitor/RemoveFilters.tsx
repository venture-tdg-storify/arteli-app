import type { FiltersSet } from '@/store/businessFilters'
import { useCallback } from 'react'
import { ProductFlags, type ProductTag } from '@/api/types.generated'
import { businessFilters } from '@/store/businessFilters'
import { SeriesFlags } from '@/utils/seriesFlags'
import { Section } from './Section'
import { Toggles } from './Toggles'

export const RemoveFilters = ({ productTags }: { productTags: ProductTag[] }) => {
  const { removeShow, removeHide } = businessFilters.use()

  const handleShowChange = useCallback((value: FiltersSet) => {
    businessFilters.set('removeShow', value)
  }, [])

  const handleHideChange = useCallback((value: FiltersSet) => {
    businessFilters.set('removeHide', value)
  }, [])

  return (
    <Section
      showSlot={
        <Toggles
          productTags={productTags}
          seriesFlags={[SeriesFlags.Inactive]}
          value={removeShow}
          onChange={handleShowChange}
          disabledProductTagIds={removeHide.productTagIds}
          onlyPrefix
        />
      }
      hideSlot={
        <Toggles
          productTags={productTags}
          productFlags={[ProductFlags.New, ProductFlags.Exclusive]}
          seriesFlags={[SeriesFlags.RecentlyAdded]}
          value={removeHide}
          onChange={handleHideChange}
          disabledProductTagIds={removeShow.productTagIds}
        />
      }
    />
  )
}
