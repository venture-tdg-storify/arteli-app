import type { ActionCompletionStatus, ProductFlags, ProductTag } from '@/api/types.generated'

export const getByProperty = <T>(items: T[], property: keyof T) => {
  type Key = keyof T
  type Index = T[keyof T]
  type Hash = Record<Key, T>

  const hash = items.reduce<Record<keyof T, T>>((acc, item) => {
    acc[item[property] as Key] = item
    return acc
  }, {} as Hash)

  return (index: Index) => {
    const item = hash[index as Key]

    if (!item) {
      throw new Error(`Item with ${property.toString()} ${index} not found`)
    }

    return item
  }
}

export const parseJWTToken = <T>(token: string): T | null => {
  try {
    const base64Url = token?.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    const utf8 = atob(base64)

    return JSON.parse(utf8) as T
  } catch (error) {
    console.error(error, 'Failed to parse JWT token')

    return null
  }
}

export const unique = <T extends string | number | object>(items: T[]) => Array.from(new Set(items))

export const groupByPropertyMulti = <T, K extends keyof T>(items: T[], property: K) => {
  type Key = T[K] extends string | number ? T[K] : never

  return items.reduce<Record<Key, T[]>>(
    (acc, item) => {
      const key = item[property] as Key
      acc[key] = [...(acc[key] ?? []), item]
      return acc
    },
    {} as Record<Key, T[]>
  )
}

export const groupByHashMulti = <T, K>(items: readonly T[], getHash: (item: T) => K) => {
  type Key = K extends string | number ? K : never

  return items.reduce<Record<Key, T[]>>(
    (acc, item) => {
      const key = getHash(item) as Key
      acc[key] = [...(acc[key] ?? []), item]
      return acc
    },
    {} as Record<Key, T[]>
  )
}

export const splitByProperty = <T>(items: T[], property: keyof T): T[][] =>
  Object.values(groupByPropertyMulti(items, property))

export const isEqual = (a: unknown, b: unknown) => {
  const aValues = [a].flat().sort()
  const bValues = [b].flat().sort()

  return aValues.length === bValues.length && aValues.every((_, i) => _ === bValues[i])
}

export const ProductTagsByIds = (tags: ProductTag[], ids: ProductTag['id'][]) =>
  tags.filter((tag) => ids.includes(tag.id))
export const ProductTagsToBitMask = (tags: ProductTag[]) => tags.reduce((acc, tag) => acc | tag.value, 0)
export const ProductFlagsToBitMask = (flags: ProductFlags[]) => flags.reduce((acc, flag) => acc | flag, 0)

export const _5_MINUTES = 5 * 60 * 1000
export const _1_HOUR = 60 * 60 * 1000

type Identifier = string | number | symbol

export const mapObject = <T, R, K extends Identifier = keyof T>(
  object: Record<K, T>,
  fn: (value: T, key: K) => R
): Record<K, R> =>
  Object.fromEntries(Object.entries<T>(object).map(([key, value]) => [key as K, fn(value, key as K)])) as Record<K, R>

export const filterObject = <T, K extends string | symbol | number = keyof T>(
  object: Record<K, T>,
  fn: (value: T, key: K) => boolean
): Record<K, T> =>
  Object.fromEntries(Object.entries<T>(object).filter(([key, value]) => fn(value, key as K))) as Record<K, T>

export const needsAttention = (statuses: ActionCompletionStatus[]) =>
  statuses.some((_) => ['Expired', 'Inactive', 'Overdue'].includes(_))
