import '@testing-library/jest-dom/vitest'
import { mockTokens } from '@/utils/tests'

vi.mock('@/utils/analytics', async () => {
  return {
    default: {
      identify: vi.fn(),
      track: vi.fn()
    }
  }
})

vi.mock('@auth0/auth0-spa-js', async () => ({
  Auth0Client: class Auth0Client {
    getTokenSilently = () => Promise.resolve(mockTokens())
  }
}))

vi.mock('@sentry/react', async () => ({
  captureException: vi.fn()
}))
