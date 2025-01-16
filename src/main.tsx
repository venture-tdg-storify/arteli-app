import { StrictMode } from 'react'
import { getSentryEnv } from '@arteli/utils'
import { LicenseInfo } from '@mui/x-license'
import * as Sentry from '@sentry/react'
import ReactDOM from 'react-dom/client'
import App from '@/components/App'
import IntlProvider from '@/components/IntlProvider'
import '@arteli/global-styles'

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_LICENSE_KEY)

const jsdWidget = () => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.setAttribute('data-jsd-embedded', '')
  script.setAttribute('data-key', '577b33c8-c4ef-4978-9417-193da57e91a3')
  script.setAttribute('data-base-url', 'https://jsd-widget.atlassian.com')
  script.src = 'https://jsd-widget.atlassian.com/assets/embed.js'
  script.onload = () => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
      })
    )
  }
  document.body.appendChild(script)
}

if (import.meta.env.VITE_SENTRY_DSN) {
  const host = location.hostname

  if (host === 'localhost') {
    console.log('Sentry is disabled because the host is localhost')
    console.log('Jira Widget is disabled because the host is localhost')
  } else {
    Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, environment: getSentryEnv(host) })
    jsdWidget()
  }
}

// For TDG data with MSW please use the following url params: ?categoryId=3.C.TW&storeIds=12.S.9e
// const { setupWorker } = await import('msw/browser')
// const { handlers } = await import('./mocks/handlers')
// const worker = setupWorker(...handlers)
// worker.start({ onUnhandledRequest: 'bypass' })

const root = ReactDOM.createRoot(document.getElementById('root') || document.body)

root.render(
  <StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </StrictMode>
)
