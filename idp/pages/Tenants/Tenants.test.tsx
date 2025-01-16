import { type FC, type ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TenantUserRoles, type TenantUser } from '$/api/system'
import { tenants } from '$/mocks/data/tenants'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import { users } from '$/mocks/data/users'
import { handlers as tenantHandlers } from '$/mocks/tenants.handlers'
import { handlers as tenantUserHandlers } from '$/mocks/tenantUsers.handlers'
import { handlers as usersHandlers } from '$/mocks/users.handlers'
import { PATH_CREATE, PATH_EDIT, PATH_TENANT_ID, PATH_TENANT_USERS, PATH_TENANT_USER_ID } from '$/routes'
import IntlProvider from '@/components/IntlProvider'
import getDesignTokens from '@/theme'
import TenantPanel from './components/TenantPanel'
import TenantUserPanel from './components/TenantUserPanel'
import Tenants from '.'

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
                <Route path={PATH_TENANT_ID} element={children}>
                  <Route path={PATH_EDIT} Component={TenantPanel} />
                  <Route path={PATH_CREATE} Component={TenantPanel} />
                  <Route path={`${PATH_TENANT_USERS}/${PATH_CREATE}`} Component={TenantUserPanel} />
                  <Route path={`${PATH_TENANT_USERS}/${PATH_TENANT_USER_ID}`} Component={TenantUserPanel} />
                </Route>
              </Routes>
            </MemoryRouter>
          </IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

const server = setupServer(...usersHandlers, ...tenantHandlers, ...tenantUserHandlers)

const findRowByText = (text: string) =>
  screen.queryAllByRole('row').find((row) => within(row).queryAllByText(text).length !== 0)

describe('Tenants', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  const expectRowToHaveText = (row: HTMLElement, text: string) =>
    expect(within(row).getByText(text)).toHaveTextContent(text)

  const check = (tenantUser: TenantUser) => {
    const row = findRowByText(tenantUser.id)

    const user = users.find((user) => user.id === tenantUser.userId)

    expectRowToHaveText(row!, user!.name!)
    expectRowToHaveText(row!, tenantUser.isActive ? 'Active' : 'Inactive')

    if (tenantUser.roles & TenantUserRoles.UserManagement) {
      expectRowToHaveText(row!, 'Customer Management')
    }

    if (tenantUser.roles & TenantUserRoles.DeleteActionSet) {
      expectRowToHaveText(row!, 'Delete Plan')
    }

    if (tenantUser.roles & TenantUserRoles.FinalizeActionSet) {
      expectRowToHaveText(row!, 'Finalize Plan')
    }

    if (tenantUser.roles & TenantUserRoles.Writer) {
      expectRowToHaveText(row!, 'Writer')
    }

    if (tenantUser.roles & TenantUserRoles.EmailNotifications) {
      expectRowToHaveText(row!, 'Email Notifications')
    }
  }

  test('renders', async () => {
    render(<Tenants />, { wrapper: createWrapper() })

    const tenant = tenants[0]

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: tenant.name })).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: 'add' })).toHaveAttribute('href', `/${tenant.id}/create`)

    await waitFor(() => {
      expect(screen.queryAllByText(tenant.name as string)).toHaveLength(2)
    })

    await waitFor(() => {
      expect(screen.getByRole('row', { name: /roles/i })).toBeInTheDocument()
    })

    tenantUsers.forEach(check)
  })

  test('opens and closes tenant create', async () => {
    render(<Tenants />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryByText(users[0].name!)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('link', { name: 'add' }))

    await waitFor(() => {
      expect(within(screen.getByRole('complementary')).getByText(/add company/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })

  test('tenant update', async () => {
    render(<Tenants />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryAllByText(tenants[0].name!)).toHaveLength(2)
    })

    fireEvent.click(screen.getByRole('button', { name: 'edit' }))

    await waitFor(() => {
      expect(within(screen.getByRole('complementary')).getByText(/edit company/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })

  test('update tenant user', async () => {
    const user = users[0]

    render(<Tenants />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryAllByRole('row')).toHaveLength(5)
    })

    const row = findRowByText(user.name!.toString())

    // fireEvent.click(screen.getByRole('link', { name: /add user/i }))
    fireEvent.click(row!)

    await waitFor(() => {
      expect(within(screen.getByRole('complementary')).getByText(/edit company customer/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(within(screen.getByRole('complementary')).getByRole('button', { name: /update/i })).toBeInTheDocument()
    })

    fireEvent.click(within(screen.getByRole('complementary')).getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })

  test('create tenant user', async () => {
    render(<Tenants />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.queryAllByRole('row')).toHaveLength(5)
    })

    fireEvent.click(screen.getByRole('link', { name: /add customer/i }))

    await waitFor(() => {
      expect(within(screen.getByRole('complementary')).getByText(/add customer to company/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })
})
