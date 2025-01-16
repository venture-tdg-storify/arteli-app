type Identifiable = { id: string | number | symbol }

export const groupById = <T extends Identifiable, Id extends Identifiable['id'] = T['id']>(items: T[]) => {
  type Result = Record<Id, T>

  return items.reduce<Result>((acc: Result, item: T): Result => {
    const id: Id = item.id as Id

    acc[id] = item

    return acc
  }, {} as Result)
}
