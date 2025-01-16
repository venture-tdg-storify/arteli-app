import type { Emitter } from 'event-emitter'
import { useSyncExternalStore } from 'react'
import EventEmitter from 'event-emitter'

export class State<T extends object> {
  private state: T
  private emitter: Emitter = EventEmitter()

  constructor(initialState: T) {
    this.state = initialState
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this.state[key]
  }

  public set<K extends keyof T>(key: K, value: T[K]) {
    this.state = { ...this.state, [key]: value }
    this.emitter.emit('change', key, value)
  }

  public setState(newState: T) {
    this.state = newState
    this.emitter.emit('change', null, newState)
  }

  public getSnapshot = (): T => {
    return this.state
  }

  public subscribe = (callback: <K extends keyof T>(key: K, value: T[K]) => void) => {
    this.emitter.on('change', callback)

    return () => this.emitter.off('change', callback)
  }

  public use = () => {
    return useSyncExternalStore(this.subscribe, this.getSnapshot)
  }
}
