type Envelope<T> = { payload: T; version: number }

export const getValue = <T>(key: string, version: number, defaultValue: T = {} as T): T => {
  try {
    const envelopeJSON = localStorage.getItem(key)

    if (envelopeJSON === null) {
      return defaultValue
    }

    const envelope: Envelope<T> = JSON.parse(envelopeJSON)

    if (version !== envelope?.version) {
      removeValue(key)

      return defaultValue
    }

    return envelope?.payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return defaultValue
  }
}

export const setValue = <T>(key: string, version: number, payload: T) => {
  localStorage.setItem(key, JSON.stringify({ payload, version } as Envelope<T>))
}

export const removeValue = (key: string) => {
  localStorage.removeItem(key)
}
