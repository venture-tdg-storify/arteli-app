import type { ActionStore } from '@/api/types.generated'
import { defineMessages } from 'react-intl'
import { ProductFlags } from '@/api/types.generated'

export const productFlagsMessages = defineMessages({
  [ProductFlags.None]: { defaultMessage: 'None', id: '450Fty' },
  [ProductFlags.Exclusive]: { defaultMessage: 'Exclusive', id: 'BKwcUu' },
  [ProductFlags.New]: { defaultMessage: 'New', id: 'bW7B87' },
  [ProductFlags.OrphanedComponents]: { defaultMessage: 'Orphaned Components', id: 'YPEe+W' }
})

export const productFlagsBackgroundColors = {
  [ProductFlags.None]: 'none',
  [ProductFlags.Exclusive]: '#D1F5FE',
  [ProductFlags.New]: '#DAF87E',
  [ProductFlags.OrphanedComponents]: 'none'
}

export const productFlagsIcons = {
  [ProductFlags.None]: 'circle',
  [ProductFlags.Exclusive]: 'fa-cart-flatbed',
  [ProductFlags.New]: 'fa-sparkles',
  [ProductFlags.OrphanedComponents]: 'circle'
}

export const actionStoreToProductFlags = (actionStore?: ActionStore | null) => {
  if (!actionStore) return ProductFlags.None

  return actionStore.productFlagsAny
}
