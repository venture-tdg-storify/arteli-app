import type { CategoryPerfRow } from './useRows'
import type { Category } from '@/api/arteli'
import { useMemo } from 'react'

export type Context = {
  stats: Record<Category['name'], { addsCount: number }>
}

export const useContext = (rows: CategoryPerfRow[]): Context =>
  useMemo(() => {
    const stats = rows.reduce(
      (acc, { categoryName }) => {
        acc[categoryName] = { addsCount: 0 }

        return acc
      },
      {} as Context['stats']
    )

    return { stats }
  }, [rows])
