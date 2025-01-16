import type { FC, ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PATH_HOME, PATH_USERS } from '$/routes'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
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
            <MemoryRouter initialEntries={[`/`]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <Routes>
                <Route path="/" element={children} />
              </Routes>
            </MemoryRouter>
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

    expect(screen.getByRole('navigation')).toMatchSnapshot()

    fireEvent.click(screen.getByRole('tab', { name: /companies/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(PATH_HOME)
    })

    navigate.mockClear()

    fireEvent.click(screen.getByRole('tab', { name: /customers/i }))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(PATH_USERS)
    })

    navigate.mockClear()
  })

  test('opens menu', async () => {
    render(<Header />, { wrapper: createWrapper() })

    // fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    // fireEvent.click(screen.getByRole('menuitem', { name: 'Arteli App' }))

    // // await waitFor(() => {
    // //   expect(navigate).toHaveBeenCalledWith()
    // // })

    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /logout/i }))

    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce()
    })
  })
})
