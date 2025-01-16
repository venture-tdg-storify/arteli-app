/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AUTH0_SCOPE: string
  readonly VITE_ARTELI_API: string
  readonly VITE_FLAG_ALLOW_LANGUAGE_SELECTION: '0' | '1'
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_FLAG_DISABLE_REFETCH_ON_WINDOW_FOCUS: '0' | '1'
  readonly VITE_ERROR_FALLBACK_TIMEOUT: number
  readonly VITE_FLAG_ALLOW_THEMING: '0' | '1'
  readonly VITE_MUI_LICENSE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
