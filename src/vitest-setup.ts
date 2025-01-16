import type { Mock } from 'vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import analytics from './utils/analytics'
import { mockTokens } from './utils/tests'

vi.mock('@/utils/analytics', async () => {
  return {
    default: {
      identify: vi.fn(),
      track: vi.fn(),
      page: vi.fn()
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

afterEach(() => {
  cleanup()
  ;(analytics?.identify as Mock).mockClear()
  ;(analytics?.track as Mock).mockClear()
  ;(analytics?.page as Mock).mockClear()
})
