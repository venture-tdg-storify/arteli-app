import { type FC, type ReactNode } from 'react'
import { random } from '@arteli/utils'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
import { PATH_ACTIVE_ACTION_SET, PATH_MANUAL_SWAP } from '@/routes'
import { notifications } from '@/store/notifications'
import { SessionProvider } from '@/store/Session'
import { settings } from '@/store/settings'
import getDesignTokens from '@/theme'
import ManualSwap from './components/ManualSwap'
import ActionSet from '.'

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
              <MemoryRouter
                initialEntries={[`/action-set?categoryId=3.C.TW&storeIds=12.S.9e`]}
                future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
              >
                <Routes>
                  <Route path={PATH_ACTIVE_ACTION_SET} element={children}>
                    <Route path={PATH_MANUAL_SWAP} Component={ManualSwap} />
                  </Route>
                  <Route path="/" element={<div>Dashboard</div>} />
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
      expect(screen.queryAllByRole('row')).toHaveLength(11)
    },
    { timeout: 2_000 }
  )
}

describe('Plan', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  const findRowByText = (text: string) => {
    return screen
      .queryAllByRole('row')
      .find((row) => within(row).queryAllByText(text, { collapseWhitespace: true }).length !== 0)
  }

  const expectRowToHaveText = (row: HTMLElement, text: string) =>
    expect(within(row).getByText(text)).toHaveTextContent(text, { normalizeWhitespace: true })

  test('renders and finalize', async () => {
    render(<ActionSet />, { wrapper: createWrapper() })

    await loading()

    expect(screen.getByText('Plan')).toBeInTheDocument()
    expect(screen.getByText(/plan summary/i)).toBeInTheDocument()

    // debug(screen.queryAllByRole('row'), 1e30)
    let row = findRowByText('262 ASHLEY HOMESTORE - ABBOTSFORD (1)')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Needs Attention')

    row = findRowByText('Ginette')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Inactive Series')
    expect(row).toMatchSnapshot()

    row = findRowByText('085 ASHLEY HOMESTORE - EDMONTON N (3)')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Needs Attention')

    row = findRowByText('Tulen')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Now on floor')
    expect(row).toMatchSnapshot()

    row = findRowByText('Store Display')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'No longer on floor')

    fireEvent.click(screen.getByRole('button', { name: /finalize/i }))
    await waitFor(() => {
      expect(screen.getByText(/are you sure that you want to finalize the current plan\?/i)).toBeInTheDocument()
    })
    expect(
      screen.getByText(
        /there are issues with the swap entries created\. you can still finalize the plan, but the swaps entered may not be able to be successfully completed\./i
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /execution due date/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /plan name/i })).toBeInTheDocument()
    expect(screen.getByTestId('CalendarIcon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: /execution due date/i }), { target: { value: '2023-01-01' } })
    fireEvent.change(screen.getByRole('textbox', { name: /plan name/i }), { target: { value: 'Test Plan' } })

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await waitFor(() => {
      expect(notifications.get('snacks')).toMatchObject([{ message: 'Plan successfully finalized' }])
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /confirm/i })).not.toBeInTheDocument()
    })
  })

  test('manual swap', async () => {
    render(<ActionSet />, { wrapper: createWrapper() })

    await loading()

    fireEvent.click(screen.getByRole('button', { name: /create swap/i }))

    await waitFor(() => {
      expect(screen.getByText(/add series to plan/i)).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    const submitButton = screen.getByRole('button', { name: /add series/i })

    expect(cancelButton).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toHaveValue('')
    // TODO: test search

    fireEvent.click(cancelButton)
    expect(expect(screen.queryByText(/add series to plan/i)).not.toBeInTheDocument())
  })

  test('download csv', async () => {
    render(<ActionSet />, { wrapper: createWrapper() })

    await loading()

    const _createElement = document.createElement

    // Prevents clicking on the button from navigating to the download URL
    Object.defineProperty(document, 'createElement', {
      value: vi.fn((...args: Parameters<typeof document.createElement>) => {
        const el = _createElement.apply(document, args)

        el.click = vi.fn()

        return el
      }),
      configurable: true
    })

    const href = `https://arteli.com/${random.String}.csv`
    const createObjectURL = vi.fn(() => href)

    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = vi.fn()

    const BlobMock = vi.fn(function (content: string, options: unknown) {
      return { content, options }
    })

    global.Blob = BlobMock as unknown as typeof Blob

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /download plan/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(BlobMock).toHaveBeenCalled()
    })

    expect(BlobMock.mock?.lastCall?.[0]).toMatchSnapshot()

    Object.defineProperty(document, 'createElement', { value: _createElement, configurable: true })
  })
})
