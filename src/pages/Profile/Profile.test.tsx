import type { ReactNode, FC } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { me } from '$/mocks/data/me'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
import { notifications } from '@/store/notifications'
import { SessionProvider } from '@/store/Session'
import getDesignTokens from '@/theme'
import Profile from '.'
const queryClient = new QueryClient()

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={createTheme(getDesignTokens('light'))}>
      <IntlProvider>
        <SessionProvider>
          <MemoryRouter initialEntries={[`/profile`]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <Routes>
              <Route path="/">
                <Route path="/profile" element={children} />
              </Route>
            </Routes>
          </MemoryRouter>
        </SessionProvider>
      </IntlProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

const server = setupServer(...handlers)

vi.mock('@/store/auth', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@/store/auth')>('@/store/auth')
  return {
    ...mod,
    logout: vi.fn()
  }
})

describe('Profile', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(() => {
    server.close()
  })

  test('renders', async () => {
    render(<Profile />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue(me.user.name)
    const email = screen.getByRole('textbox', { name: /email/i })
    expect(email).toHaveValue(me.user.email)
    expect(email).toBeDisabled()
    expect(screen.getByRole('textbox', { name: /picture url/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /label/i })).toBeInTheDocument()
  })

  test('renders error', async () => {
    render(<Profile />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    fireEvent.change(screen.getByRole('textbox', { name: /name/i }), { target: { value: null } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument()
    })
  })

  test('update', async () => {
    render(<Profile />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    const name = screen.getByRole('textbox', { name: /name/i })
    fireEvent.change(name, { target: { value: 'ABC' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Profile successfully updated' }])
    })
  })
})
