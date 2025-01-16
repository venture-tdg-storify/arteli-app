import type { ICache } from './allIdsQuery'

export class InMemoryCache<T extends { id: string }> implements ICache<T> {
  entities: Record<T['id'], T> = {} as Record<T['id'], T>

  getById = (id: T['id']) => this.entities[id]
  getByIds = (ids: T['id'][]) => ids.map((id) => this.entities[id]).filter((_) => _ !== undefined)
  add = (entity: T) => {
    this.entities[entity.id as T['id']] = entity
  }
}
