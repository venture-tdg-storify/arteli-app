import type { Category, CategoryPerf } from '@/api/types.generated'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { groupByPropertyMulti, splitByProperty as split } from '@/utils/groupByPropertyMulti'
import { dateRange } from './dateRange'
import { useDemoData } from './useDemoData'
import { usePerfReport } from './usePerfReport'

export type CategoryPerfRow = {
  arteliAvgPerStore: number
  manualAvgPerStore: number
  newGroupAvgPerStore: number
  categoryName: string
}

export type Charts = {
  arteliSales: number
  manualSales: number
  newGroupSales: number
  month: string
}[]

// const range = (start: Dayjs, stop: Dayjs, step = 1) =>
//   Array.from({ length: stop.diff(start, 'days') / step + 1 }, (_, i) => start.add(i * step, 'day'))

// const randomWithinRange = (min: number, max: number) => Math.random() * (max - min) + min

const sumUpAverages = (categoryPerfs: CategoryPerf[]) => {
  const noOfCategoryPerfs = categoryPerfs.length

  if (noOfCategoryPerfs === 0) {
    return { arteliAvgPerStore: 0, manualAvgPerStore: 0, newGroupAvgPerStore: 0 }
  }

  const { arteliSalesSum, newGroupSalesSum, manualSalesSum, manualStoresSum, newGroupStoresSum, arteliStoresSum } =
    categoryPerfs.reduce(
      (acc, { arteliSales, newGroupSales, manualSales, manualStores, newGroupStores, arteliStores }) => ({
        arteliSalesSum: arteliSales + acc.arteliSalesSum,
        newGroupSalesSum: newGroupSales + acc.newGroupSalesSum,
        manualSalesSum: manualSales + acc.manualSalesSum,
        manualStoresSum: manualStores + acc.manualStoresSum,
        newGroupStoresSum: newGroupStores + acc.newGroupStoresSum,
        arteliStoresSum: arteliStores + acc.arteliStoresSum
      }),
      {
        arteliSalesSum: 0,
        newGroupSalesSum: 0,
        manualSalesSum: 0,
        manualStoresSum: 0,
        newGroupStoresSum: 0,
        arteliStoresSum: 0
      }
    )

  const arteliAvgPerStore = arteliSalesSum / Math.max(arteliStoresSum, 1)
  const newGroupAvgPerStore = newGroupSalesSum / Math.max(newGroupStoresSum, 1)
  const manualAvgPerStore = manualSalesSum / Math.max(manualStoresSum, 1)

  return { arteliAvgPerStore, manualAvgPerStore, newGroupAvgPerStore }
}

const sumUp = (categoryPerfs: CategoryPerf[]) => {
  const noOfCategoryPerfs = categoryPerfs.length

  if (noOfCategoryPerfs === 0) {
    return { arteliSales: 0, manualSales: 0, newGroupSales: 0 }
  }

  return categoryPerfs.reduce(
    (acc, { arteliSales, manualSales, newGroupSales }) => {
      return {
        arteliSales: arteliSales + acc.arteliSales,
        manualSales: manualSales + acc.manualSales,
        newGroupSales: newGroupSales + acc.newGroupSales
      }
    },
    { arteliSales: 0, manualSales: 0, newGroupSales: 0 }
  )
}

export const useRows = ({ selectedCategory }: { selectedCategory: Category['name'][] }) => {
  const { from, to } = dateRange.use()
  const isDemo = location.hostname === 'demo.arteli.com'

  const {
    isFetching,
    isRefetching,
    refetch,
    data: categoryRealPerfs
  } = usePerfReport({
    params: { fromDate: from.format('YYYY-MM-DD'), toDate: to.format('YYYY-MM-DD') },
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity
  })

  const { rows: categoryDemoPerfs } = useDemoData(from, to)

  const categoryPerfs = isDemo ? categoryDemoPerfs : categoryRealPerfs

  const [rows, setRows] = useState<CategoryPerfRow[]>([])
  const [charts, setCharts] = useState<Charts>()

  useEffect(() => {
    if (isFetching || isRefetching || !categoryPerfs) {
      return
    }

    const rows = split(categoryPerfs, 'categoryName')
      .map((categoryPerfs) => ({
        categoryName: categoryPerfs[0].categoryName,
        ...sumUpAverages(categoryPerfs)
      }))
      .filter(({ categoryName }) => categoryName !== '<No Category>')
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName))

    setRows(rows)
  }, [categoryPerfs, isFetching, isRefetching])

  useEffect(() => {
    if (!categoryPerfs) {
      return
    }

    const chartCategoryPerfs = selectedCategory
      ? categoryPerfs.filter((categoryPerf) => selectedCategory.includes(categoryPerf.categoryName))
      : categoryPerfs

    const categoryPerfsPerMonth = groupByPropertyMulti(
      chartCategoryPerfs.map((categoryPerf) => ({
        ...categoryPerf,
        month: dayjs(categoryPerf.date).format('YYYY-MM')
      })),
      'month'
    )

    const charts = Object.entries(categoryPerfsPerMonth).map(([month, categoryPerfs = []]) => ({
      month,
      ...sumUp(categoryPerfs)
    }))

    setCharts(charts)
  }, [categoryPerfs, selectedCategory])

  return { rows, isFetching: isFetching || isRefetching, refetch, charts }
}
