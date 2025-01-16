import type { FiltersSet } from '@/store/businessFilters'
import { useCallback } from 'react'
import { ProductFlags, type ProductTag } from '@/api/types.generated'
import { businessFilters } from '@/store/businessFilters'
import { SeriesFlags } from '@/utils/seriesFlags'
import { Section } from './Section'
import { Toggles } from './Toggles'

// const noTags: ProductTag['id'][] = []

export const AddFilters = ({ tags }: { tags: ProductTag[] }) => {
  const { addShow, addHide } = businessFilters.use()

  const handleShowChange = useCallback((value: FiltersSet) => {
    businessFilters.set('addShow', value)
  }, [])

  const handleHideChange = useCallback((value: FiltersSet) => {
    businessFilters.set('addHide', value)
  }, [])

  // const disabledProductTagIds = useMemo(() => {
  //   return addShow.productTagIds.length ? tags.map((_) => _.id) : noTags
  // }, [addShow.productTagIds.length, tags])

  const disabledProductTagIds = addShow.productTagIds

  return (
    <Section
      showSlot={
        <Toggles
          productTags={tags}
          productFlags={[ProductFlags.New, ProductFlags.Exclusive]}
          value={addShow}
          onChange={handleShowChange}
          disabledProductTagIds={addHide.productTagIds}
          onlyPrefix
        />
      }
      hideSlot={
        <Toggles
          seriesFlags={[SeriesFlags.RecentlyRemoved, SeriesFlags.NegativeMargin]}
          productTags={tags}
          value={addHide}
          onChange={handleHideChange}
          disabledProductTagIds={disabledProductTagIds}
        />
      }
    />
  )
}
