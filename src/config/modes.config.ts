export const modes = {
  Light: 'light',
  Dark: 'dark',
  System: 'system'
}

export type Modes = typeof modes

export type Mode = Modes[keyof Modes]
