export const groupByPropertyMulti = <T>(items: T[], property: keyof T): Record<string, T[]> =>
  items.reduce<Record<string, T[]>>((acc, item) => {
    const key = item[property] as string
    acc[key] = [...(acc[key] ?? []), item]
    return acc
  }, {})

export const splitByProperty = <T>(items: T[], property: keyof T): T[][] =>
  Object.values(groupByPropertyMulti(items, property))
