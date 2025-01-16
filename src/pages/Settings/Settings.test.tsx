import type { ReactNode, FC } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor, screen, fireEvent, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import IntlProvider from '@/components/IntlProvider'
import { tenantSettings } from '@/mocks/data/tenantSettings'
import { handlers } from '@/mocks/handlers'
import { PATH_SETTINGS, PATH_SETTINGS_PLAN, PATH_SETTINGS_RECOMMENDATIONS } from '@/routes'
import { notifications } from '@/store/notifications'
import { SessionProvider } from '@/store/Session'
import { settings } from '@/store/settings'
import getDesignTokens from '@/theme'
import BusinessRules from './components/BusinessRules'
import DashboardSettings from './components/DashboardSettings'
import PlanSettings from './components/PlanSettings'
import Settings from '.'

const createWrapper = ({ path }: { path: string }): FC<{ children: ReactNode }> => {
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
              <MemoryRouter initialEntries={[path]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <Routes>
                  <Route path={PATH_SETTINGS} element={children}>
                    <Route index Component={DashboardSettings} />
                    <Route path={PATH_SETTINGS_RECOMMENDATIONS} Component={BusinessRules} />
                    <Route path={PATH_SETTINGS_PLAN} Component={PlanSettings} />
                  </Route>
                </Routes>
              </MemoryRouter>
            </SessionProvider>
          </IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

settings.set('tenantUserId', tenantUsers[0].id)
const server = setupServer(...handlers)

const loading = async () => {
  await waitFor(
    () => {
      expect(
        screen.getByRole('heading', {
          name: /saved power bi reports/i
        })
      ).toBeInTheDocument()
    },
    { timeout: 2_000 }
  )
}

describe('Settings', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(() => {
    server.close()
  })

  test('renders and delete saved report', async () => {
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS }) })

    await loading()

    expect(screen.getByRole('heading', { name: /power bi report settings/i })).toBeInTheDocument()
    expect(
      screen.getByText(
        /add power bi reports that show up on the dashboard\. only links to microsoft power bi reports are supported./i
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    const tooltip = screen.getByRole('tooltip', {
      name: 'Monthly Performance Report https://monthlyperformancereport.com Delete Save'
    })
    expect(tooltip).toBeInTheDocument()
    expect(within(tooltip).getByRole('button', { name: /save/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Report removed successfully' }])
    })
  })

  test('add new report', async () => {
    notifications.set('snacks', [])
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS }) })

    await loading()

    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBe(2)
    fireEvent.change(textboxes[0], { target: { value: 'some name' } })
    fireEvent.change(textboxes[1], { target: { value: 'https://arteli.com' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(
        screen.getByText(
          'This link does not appear to link to a Power BI report. Improper links could prevent the app from operating correctly. Are you sure you want to add this link?'
        )
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Report added successfully' }])
    })
  })

  test('update report', async () => {
    notifications.set('snacks', [])
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS }) })

    await loading()

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    const tooltip = screen.getByRole('tooltip', {
      name: 'Monthly Performance Report https://monthlyperformancereport.com Delete Save'
    })
    expect(tooltip).toBeInTheDocument()
    const saveButton = within(tooltip).getByRole('button', { name: /save/i })
    expect(saveButton).toBeInTheDocument()
    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBe(4)
    expect(textboxes[2]).toHaveValue(tenantSettings.powerBiReports[0].name)
    expect(textboxes[3]).toHaveValue(tenantSettings.powerBiReports[0].url)
    fireEvent.change(textboxes[2], { target: { value: 'some name' } })
    fireEvent.change(textboxes[3], { target: { value: 'https://arteli.com' } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Company settings updated successfully' }])
    })
  })

  test('update company settings', async () => {
    notifications.set('snacks', [])
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS_PLAN }) })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /plan settings/i })).toBeInTheDocument()
    })

    const spinbutton = screen.getByRole('spinbutton')
    expect(spinbutton).toBeInTheDocument()
    expect(spinbutton).toHaveValue(30)

    fireEvent.change(spinbutton, { value: 32 })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Company settings updated successfully' }])
    })
  })

  test('update recommendations', async () => {
    notifications.set('snacks', [])
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS_RECOMMENDATIONS }) })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: /recommendations/i })).toBeInTheDocument()
    expect(
      screen.getByText(/customize your add \+ remove recommendations by establishing your business rules here\./i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /based off of your csv upload, you can select the tags that you want to utilize in the business monitor\./i
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /product tags/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /show label/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /add recommendation filter/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('rowheader', { name: /outlet/i })).toBeInTheDocument()
    })
    let row = screen.getByRole('row', { name: /outlet/i })
    expect(row).toBeInTheDocument()
    let checkboxes = within(row).getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).not.toBeChecked()
    expect(checkboxes[2]).not.toBeChecked()

    row = screen.getByRole('row', { name: /vaquita/i })
    checkboxes = within(row).getAllByRole('checkbox')
    expect(checkboxes[0]).toBeChecked()
    expect(checkboxes[1]).toBeChecked()
    expect(checkboxes[2]).toBeChecked()

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    expect(saveButton).toBeDisabled()

    fireEvent.click(checkboxes[0])
    expect(saveButton).toBeEnabled()

    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Settings saved successfully' }])
    })
  })

  test('update operating cost', async () => {
    notifications.set('snacks', [])
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS_RECOMMENDATIONS }) })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(
      screen.getByText(
        /input your operating cost per category to filter out series that fall below the specified cost\. disclaimer: if there is no input for a category, the operating cost will default to \$0\./i
      )
    ).toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: /category/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /operating cost/i })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('rowheader', { name: /accessories/i })).toBeInTheDocument()
    })

    const row = screen.getByRole('row', { name: /accessories/i })
    expect(row).toBeInTheDocument()
    const spinbutton = within(row).getByRole('spinbutton')
    expect(spinbutton).toHaveValue(0.1)

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    expect(saveButton).toBeDisabled()

    fireEvent.change(spinbutton, { target: { value: 0 } })
    expect(saveButton).toBeEnabled()

    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Operating Cost saved successfully' }])
    })
  })

  test('update floor date', async () => {
    notifications.set('snacks', [])
    render(<Settings />, { wrapper: createWrapper({ path: PATH_SETTINGS_RECOMMENDATIONS }) })

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    expect(screen.getByText(/recently added to floor date/i)).toBeInTheDocument()
    expect(
      screen.getByText(/specify how many days is considered recent in terms of adding a series to the floor\./i)
    ).toBeInTheDocument()

    const spinButtons = screen.getAllByRole('spinbutton')
    expect(spinButtons.length).toBe(2)
    await waitFor(() => {
      expect(spinButtons[0]).toHaveValue(30)
    })

    expect(screen.getByText(/recently removed from floor date/i)).toBeInTheDocument()
    expect(
      screen.getByText(/specify how many days is considered recent in terms of removing a series to the floor\./i)
    ).toBeInTheDocument()
    expect(spinButtons[1]).toHaveValue(30)

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    expect(saveButton).toBeDisabled()

    fireEvent.change(spinButtons[1], { target: { value: 32 } })

    expect(spinButtons[1]).toHaveValue(32)
    expect(saveButton).toBeEnabled()

    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Settings saved successfully' }])
    })
  })
})
