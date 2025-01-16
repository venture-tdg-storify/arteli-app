import type { CategoryPerf } from '@/api/types.generated'
import type { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useAllRelevantCategories } from '@/hooks/arteli'

const range = (start: Dayjs, stop: Dayjs, step = 1) =>
  Array.from({ length: stop.diff(start, 'days') / step + 1 }, (_, i) => start.add(i * step, 'day'))

const randomWithinRange = (min: number, max: number) => Math.random() * (max - min) + min

const initialData: CategoryPerf[] = [] as CategoryPerf[]

export const useDemoData = (from: Dayjs, to: Dayjs) => {
  const { data: categories, isFetching } = useAllRelevantCategories()

  const categoriesWithIndex = useMemo(
    () => categories?.map((category) => ({ ...category, index: Math.floor(Math.random() * 8) })),
    [categories]
  )

  const perfs = useMemo(
    () =>
      range(from, to).map((day, index) =>
        (categoriesWithIndex ?? []).map((category) => ({
          date: day.format('YYYY-MM-DD'),
          arteliSales: randomWithinRange(index, 100 + category.index) * category.index,
          manualSales: randomWithinRange(index, 1000) * category.index,
          newGroupSales: randomWithinRange(index, 200) * category.index,
          manualStores: randomWithinRange(10, 50),
          newGroupStores: randomWithinRange(2, 12),
          arteliStores: randomWithinRange(1, 5),
          categoryName: category.name
        }))
      ),
    [categoriesWithIndex, from, to]
  )

  const [rows, setRows] = useState<CategoryPerf[]>(initialData)

  useEffect(() => {
    setRows((prevRows) => {
      if (categories?.length === 0) {
        return initialData
      }

      if (isFetching) {
        return prevRows
      }

      const partialRows = perfs.flat()

      if (!partialRows?.length) {
        return initialData
      }

      return partialRows
    })
  }, [categories?.length, isFetching, perfs])

  return { rows, isFetching }
}
