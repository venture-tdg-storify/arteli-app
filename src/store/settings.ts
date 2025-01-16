import type { TenantUser, UserJobTypesType } from '@/api/arteli'
import type { Locale } from '@/config/locales.config'
import type { Mode } from '@/config/modes.config'
import { State } from '@arteli/state'
import { getLocalValue, removeLocalValue, setLocalValue } from '@arteli/utils'
import { locales } from '@/config/locales.config'
import { modes } from '@/config/modes.config'
import { session } from './auth'

const ARTELI_SETTINGS_KEY = 'arteli-settings'
const VERSION = 2

type Settings = {
  locale: Locale
  mode: Mode
  doNotShowRejectionWarning: boolean
  tenantUserId?: TenantUser['id']
  fileUploadType: UserJobTypesType
}

export const settings = new State<Settings>(
  getLocalValue(ARTELI_SETTINGS_KEY, VERSION, {
    locale: locales.us,
    mode: modes.Light,
    doNotShowRejectionWarning: false,
    fileUploadType: 'ProductFlagsCsv'
  })
)

export const setLocale = (locale: Locale) => {
  settings.set('locale', locale)
}

export const setMode = (mode: Mode) => {
  settings.set('mode', mode)
}

export const setDoNotShowRejectionWarning = (doNotShowRejectionWarning: boolean) => {
  settings.set('doNotShowRejectionWarning', doNotShowRejectionWarning)
}

export const setTenantUserId = (tenantUserId: TenantUser['id']) => {
  settings.set('tenantUserId', tenantUserId)
}

export const setFileUploadType = (fileUploadType: UserJobTypesType) => {
  settings.set('fileUploadType', fileUploadType)
}

settings.subscribe(() => {
  // console.log('🔧 Settings changed', ...args)
  setLocalValue(ARTELI_SETTINGS_KEY, VERSION, settings.getSnapshot())
})

session.subscribe(() => {
  const { tokens } = session.getSnapshot()

  if (tokens !== null) return

  console.log('❌ Removing settings from localStorage')
  removeLocalValue(ARTELI_SETTINGS_KEY)
})
