import type { ProductFlags, ProductTag } from '@/api/arteli'
import type { SeriesFlags } from '@/utils/seriesFlags'
import { State } from '@arteli/state'
import { getLocalValue, removeLocalValue, setLocalValue } from '@arteli/utils'
import { session } from './auth'

const STORAGE_KEY = 'arteli-business-filters'
const VERSION = 2

export type FiltersSet = {
  productFlags: ProductFlags[]
  seriesFlags: SeriesFlags[]
  productTagIds: ProductTag['id'][]
}

type BusinessFilters = {
  addShow: FiltersSet
  addHide: FiltersSet
  removeShow: FiltersSet
  removeHide: FiltersSet
}

const EMPTY_FILTERS: BusinessFilters = {
  addShow: { productFlags: [], seriesFlags: [], productTagIds: [] },
  addHide: { productFlags: [], seriesFlags: [], productTagIds: [] },
  removeShow: { productFlags: [], seriesFlags: [], productTagIds: [] },
  removeHide: { productFlags: [], seriesFlags: [], productTagIds: [] }
}

const getFromLocalStorage = () => getLocalValue(STORAGE_KEY, VERSION, EMPTY_FILTERS)

export const businessFilters = new State<BusinessFilters>(getFromLocalStorage())

businessFilters.subscribe(() => {
  // console.log('Business filters changed', ...args)
  setLocalValue(STORAGE_KEY, VERSION, businessFilters.getSnapshot())
})

session.subscribe(() => {
  const { tokens } = session.getSnapshot()

  if (tokens !== null) return

  console.log('❌ Removing business filters from localStorage')

  removeLocalValue(STORAGE_KEY)
})

window.onstorage = (event: StorageEvent) => {
  if (event.key !== STORAGE_KEY) return

  console.log(`BusinessFilters updated based of localStorage`)

  businessFilters.setState(getFromLocalStorage())
}
