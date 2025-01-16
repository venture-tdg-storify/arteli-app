export const groupByProperty = <T>(items: T[], property: keyof T) =>
  items.reduce<Record<string, T>>((acc, item) => {
    acc[item[property] as string] = item
    return acc
  }, {})
