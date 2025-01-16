export const timezones = Intl.supportedValuesOf('timeZone')

export const defaultTimeZone =
  timezones.find((tz) => tz === Intl.DateTimeFormat().resolvedOptions().timeZone) || 'America/New_York'
