import type { Mock } from 'vitest'
import type { ReactNode, FC } from 'react'
import { random } from '@arteli/utils'
import { render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { handlers } from '@/mocks/handlers'
import { auth0, getReturnToUrl } from '@/store/auth'
import analytics from '@/utils/analytics'
import Auth from '.'

const navigate = vi.fn()

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
    getReturnToUrl: vi.fn(),
    auth0: {
      getUser: vi.fn()
    }
  }
})

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={[`/auth`]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <Routes>
      <Route path="/auth" element={children} />
    </Routes>
  </MemoryRouter>
)

const server = setupServer(...handlers)

describe('Auth', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(() => {
    server.close()
  })

  test('tries to load tokens from hash and redirects', async () => {
    render(<Auth />, { wrapper: Wrapper })

    expect(screen.queryByRole('progressbar')).toBeInTheDocument()

    expect(getReturnToUrl).toHaveBeenCalled()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('redirects to returnTo value from token', async () => {
    const returnTo = random.String
    const user = {
      sub: random.String
    }

    ;(getReturnToUrl as Mock).mockResolvedValueOnce(returnTo)
    ;(auth0.getUser as Mock).mockResolvedValueOnce(user)

    render(<Auth />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(analytics?.track).toHaveBeenCalledWith('User Logged In', { id: user.sub })
      expect(navigate).toHaveBeenCalledWith(returnTo, { replace: true })
    })
  })
})
