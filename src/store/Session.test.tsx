import type { FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
// import { UserRoles, TenantUserRoles } from '$/api/system'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import { getUserById } from '$/mocks/data/users'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
import { SessionProvider } from './Session'
import { settings } from './settings'

settings.set('tenantUserId', tenantUsers[0].id)

const server = setupServer(...handlers)

const createWrapper = (): FC<{ children: ReactNode }> => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  })

  return ({ children }) => {
    return (
      <IntlProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </IntlProvider>
    )
  }
}

describe('Session', () => {
  const oldLocation = window.location

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })

    Object.defineProperty(window, 'location', {
      value: {
        ...oldLocation,
        replace: vi.fn(),
        pathname: '/'
      },
      configurable: true
    })
  })

  afterAll(async () => {
    server.close()

    Object.defineProperty(window, 'location', {
      value: oldLocation,
      configurable: true
    })
  })

  test('check if tenant exists', async () => {
    server.use(
      http.get(
        `${import.meta.env.VITE_SYSTEM_API}/me`,
        () => HttpResponse.json({ tenantUsers: [], user: getUserById('1!U-mhErmw') }),
        { once: true }
      )
    )

    render(<SessionProvider>#</SessionProvider>, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(screen.getByText('This account is not associated with an organization')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  test('check if categories exists', async () => {
    server.use(
      http.get(
        `${import.meta.env.VITE_SYSTEM_API}/me`,
        () =>
          HttpResponse.json({
            tenantUsers: [{ ...tenantUsers[0], storeExternalIds: ['*'], categoryExternalIds: [] }],
            user: getUserById('1!U-mhErmw')
          }),
        { once: true }
      )
    )

    render(<SessionProvider>#</SessionProvider>, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(
      screen.getByText('You have no category or stores assigned, please contact your administrator')
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  test('check if stores exists', async () => {
    server.use(
      http.get(
        `${import.meta.env.VITE_SYSTEM_API}/me`,
        () =>
          HttpResponse.json({
            tenantUsers: [
              {
                ...tenantUsers[0],
                storeExternalIds: [],
                categoryExternalIds: ['*']
              }
            ],
            user: getUserById('1!U-mhErmw')
          }),
        { once: true }
      )
    )

    render(<SessionProvider>#</SessionProvider>, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(
      screen.getByText('You have no category or stores assigned, please contact your administrator')
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })
})
