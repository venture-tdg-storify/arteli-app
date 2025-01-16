import { StrictMode } from 'react'
import { getSentryEnv } from '@arteli/utils'
import * as Sentry from '@sentry/react'
import ReactDOM from 'react-dom/client'
import App from '$/components/App'
import IntlProvider from '$/components/IntlProvider'
import '@arteli/global-styles'

if (import.meta.env.VITE_SENTRY_DSN) {
  const host = location.hostname

  if (host === 'localhost') {
    console.log('Sentry is disabled because the host is localhost')
  } else {
    Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, environment: getSentryEnv(host) })
  }
}

// const loadWorker = async () => {
//   const { setupWorker } = await import('msw/browser')
//   const { handlers: tenantUsers } = await import('./mocks/tenantUsers.handlers')
//   const { handlers: users } = await import('./mocks/users.handlers')
//   const { handlers: tenants } = await import('./mocks/tenants.handlers')
//   const { handlers: auth } = await import('./mocks/auth.handlers')

//   const worker = setupWorker(...auth, ...tenantUsers, ...users, ...tenants)
//   worker.start({ onUnhandledRequest: 'bypass' })
// }

// loadWorker()

const root = ReactDOM.createRoot(document.getElementById('root') || document.body)

root.render(
  <StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </StrictMode>
)
