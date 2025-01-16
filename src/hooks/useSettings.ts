import { useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { modes } from '@/config/modes.config'
import {
  settings,
  setLocale,
  setMode,
  setDoNotShowRejectionWarning,
  setTenantUserId,
  setFileUploadType
} from '@/store/settings'

export const useSettings = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { mode, locale, doNotShowRejectionWarning, tenantUserId, fileUploadType } = settings.use()

  const isDarkMode = useMemo(() => {
    return mode === modes.System ? prefersDarkMode : mode === modes.Dark
  }, [mode, prefersDarkMode])

  return {
    mode,
    locale,
    isDarkMode,
    setMode,
    setLocale,
    doNotShowRejectionWarning,
    setDoNotShowRejectionWarning,
    setFileUploadType,
    tenantUserId,
    setTenantUserId,
    fileUploadType
  }
}
