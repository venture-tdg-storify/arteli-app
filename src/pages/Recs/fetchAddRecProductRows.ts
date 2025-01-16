import type { Group, AddRecProduct, Subgroup, Product, Subcategory, Category, Store } from '@/api/arteli'
import { groupById } from '@arteli/utils'
import api from '@/api'
import { fetchAllProductsByIds, fetchAllSubcategoriesByIds } from '@/hooks/arteli'
import { unique } from '@/utils'

export type AddRecProductRow = {
  addRecProduct: AddRecProduct
  product: Product
  subcategory: Subcategory
}

export const fetchAddRecProductRows = async (params: {
  categoryId: Category['id']
  groupId: Group['id']
  subgroupId: Subgroup['id']
  storeIds: Store['id'][]
  subcategoryIds: Subcategory['id'][]
}) => {
  const addRecProducts = await api.Arteli.Recs.getAddRecProducts({ params: params! })

  const productIds = unique(addRecProducts.map(({ productId }) => productId))
  const products = await fetchAllProductsByIds({ params: { ids: productIds } })

  const subcategoryIds = unique(products.map(({ subcategoryId }) => subcategoryId))

  const subcategories = await fetchAllSubcategoriesByIds({ params: { ids: subcategoryIds } })

  const productsById = groupById(products)
  const subcategoriesById = groupById(subcategories)

  return (addRecProducts ?? []).map((addRecProduct) => {
    const product = productsById[addRecProduct.productId]

    return { addRecProduct, product, subcategory: subcategoriesById[product.subcategoryId] }
  })
}
