export const locales = {
  us: 'en-US',
  gb: 'en-GB',
  fr: 'fr-FR',
  ca: 'fr-CA',
  xy: 'xy-XY'
}

export type Locales = typeof locales

export type Locale = Locales[keyof Locales]
