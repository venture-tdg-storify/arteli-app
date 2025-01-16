import { type FC, type ReactNode } from 'react'
import { random } from '@arteli/utils'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserRoles, type User } from '$/api/system'
import { users } from '$/mocks/data/users'
import { handlers as usersHandlers } from '$/mocks/users.handlers'
import { PATH_CREATE, PATH_USERS, PATH_USER_ID } from '$/routes'
import IntlProvider from '@/components/IntlProvider'
import getDesignTokens from '@/theme'
import UserPanel from './components/UserPanel'
import Users from '.'

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
            <MemoryRouter initialEntries={[`/users`]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <Routes>
                <Route path={PATH_USERS} element={children}>
                  <Route path={PATH_CREATE} Component={UserPanel} />
                  <Route path={PATH_USER_ID} Component={UserPanel} />
                </Route>
              </Routes>
            </MemoryRouter>
          </IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

const server = setupServer(...usersHandlers)

const findRowByText = (text: string) => {
  return screen
    .queryAllByRole('row')
    .find((row) => within(row).queryAllByText(text, { collapseWhitespace: true }).length !== 0)
}

describe('Users', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  const expectRowToHaveText = (row: HTMLElement, text: string) =>
    expect(within(row).getByText(text)).toHaveTextContent(text)

  test('renders', async () => {
    render(<Users />, { wrapper: createWrapper() })

    expect(screen.getByRole('heading', { name: /customers/i })).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /create/i })).toHaveAttribute('href', '/users/create')

    await waitFor(() => {
      expect(screen.queryByText(users[0].name as string)).toBeInTheDocument()
    })

    const check = (user: User) => {
      const row = findRowByText(user.email!.toString())

      expectRowToHaveText(row!, user.id!)
      expectRowToHaveText(row!, user.name!)
      expectRowToHaveText(row!, user.isActive ? 'Active' : 'Inactive')
      expectRowToHaveText(row!, user.roles & UserRoles.Staff ? 'Staff' : 'None')
    }

    users.forEach(check)
  })

  test('opens and closes side panel', async () => {
    render(<Users />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByText(users[0].name!)).toBeInTheDocument()
    })

    fireEvent.click(findRowByText(users[0].name!)!)

    await waitFor(() => {
      expect(within(screen.getByRole('complementary')).getByText(/edit customer/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })

  test('update user', async () => {
    const user = users[0]

    render(<Users />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryAllByRole('row')).toHaveLength(6)
    })

    const row = findRowByText(user.name!.toString())

    expect(row).toMatchSnapshot()

    fireEvent.click(row!)

    await waitFor(
      () => {
        expect(within(screen.getByRole('complementary')).getByDisplayValue(user.name!)).toBeInTheDocument()
      },
      { timeout: 1000 }
    )

    const input = within(screen.getByRole('complementary')).getByDisplayValue(user.name!) as HTMLInputElement
    const randomName = random.String
    fireEvent.change(input, { target: { value: randomName } })
    expect(input.value).toBe(randomName)

    fireEvent.click(within(screen.getByRole('complementary')).getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })

  test('create user', async () => {
    render(<Users />, { wrapper: createWrapper() })

    fireEvent.click(screen.getByRole('link', { name: /create customer/i }))

    await waitFor(
      () => {
        expect(screen.getByRole('complementary')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )

    // TODO: Further test the form elements

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })
})
