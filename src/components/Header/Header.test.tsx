import type { FC, ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { me } from '$/mocks/data/me'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
import { PATH_ACTIVE_ACTION_SET, PATH_PROFILE, PATH_RECOMMENDATIONS_ADD } from '@/routes'
import { SessionProvider } from '@/store/Session'
import getDesignTokens from '@/theme'
import Header from '.'

const navigate = vi.fn()
const logout = vi.fn()

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...mod,
    useNavigate: () => navigate
  }
})

vi.mock('@/store/auth', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@/store/auth')>('@/store/auth')
  return {
    ...mod,
    logout: (...args: unknown[]) => logout(...args)
  }
})

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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createTheme(getDesignTokens('light'))}>
          <IntlProvider>
            <SessionProvider>
              <MemoryRouter initialEntries={[`/`]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <Routes>
                  <Route path="/" element={children} />
                </Routes>
              </MemoryRouter>
            </SessionProvider>
          </IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

const server = setupServer(...handlers)

describe('Header', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  test('renders and navigates on tab click', async () => {
    render(<Header />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByText(me.user.name)).toBeInTheDocument()
    })

    expect(screen.getByRole('navigation')).toMatchSnapshot()

    fireEvent.click(screen.getByRole('tab', { name: /recommendations/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ pathname: PATH_RECOMMENDATIONS_ADD, search: '' })
    })

    navigate.mockClear()

    fireEvent.click(screen.getByRole('tab', { name: /plan/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ pathname: PATH_ACTIVE_ACTION_SET, search: '' })
    })
  })

  test('opens menu', async () => {
    render(<Header />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByText(me.user.name)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /menu/i }))

    expect(screen.queryByRole('menuitem', { name: /identity provider/i })).not.toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /help/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('menuitem', { name: /profile/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ pathname: PATH_PROFILE, search: '' })
    })

    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /logout/i }))

    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce()
    })
  })
})
