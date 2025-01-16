import React, { useMemo } from 'react'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import en from '@/../lang/en.json'
import fr from '@/../lang/fr.json'
import { locales } from '@/config/locales.config'
import { useSettings } from '@/hooks/useSettings'

const cache = createIntlCache()

const messages = {
  [locales.gb]: en,
  [locales.us]: en,
  [locales.ca]: fr,
  [locales.fr]: fr,
  [locales.xy]: Object.fromEntries(Object.entries(en).map(([k]) => [k, '--']))
}

// Pass it to IntlProvider
export const IntlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale } = useSettings()

  const intl = useMemo(() => {
    return createIntl({ locale, messages: messages[locale] }, cache)
  }, [locale])

  return <RawIntlProvider value={intl}>{children}</RawIntlProvider>
}
