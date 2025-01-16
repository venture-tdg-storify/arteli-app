import { type FC, type ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import IntlProvider from '@/components/IntlProvider'
import LiveView from '@/components/LiveView'
import { handlers } from '@/mocks/handlers'
import { PATH_LIVE_VIEW, PATH_RECOMMENDATIONS_ADD, PATH_REJECT } from '@/routes'
import { SessionProvider } from '@/store/Session'
import { settings } from '@/store/settings'
import getDesignTokens from '@/theme'
import RejectionPanel from './components/RejectionPanel'
import Recs from '.'

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
                initialEntries={['/recommendations/Add/?categoryId=3.C.TW&storeIds=12.S.9e']}
                future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
              >
                <Routes>
                  <Route path={PATH_RECOMMENDATIONS_ADD} element={children}>
                    <Route path={PATH_REJECT} Component={RejectionPanel} />
                    <Route path={PATH_LIVE_VIEW} Component={LiveView} />
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
      expect(screen.queryAllByRole('row')).toHaveLength(4)
    },
    { timeout: 2_000 }
  )
}

const findRowByText = (text: string) =>
  screen.queryAllByRole('row').find((row) => within(row).queryAllByText(text).length !== 0)

describe('Recs', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  test('renders', async () => {
    render(<Recs />, { wrapper: createWrapper() })

    await loading()

    expect(screen.getByRole('heading', { name: /recommendations/i })).toBeInTheDocument()
    expect(screen.getByText(/select recommendations for store plans\./i)).toBeInTheDocument()
    expect(
      screen.getByText(/data updates occur regularly to reflect ongoing improvements in our algorithm\./i)
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/predicted values are using sales data through 5\/21\/2024/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/recommendations summary/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view plan/i })).toHaveAttribute('href', '/action-set')

    const groupRow = findRowByText('Foundation')
    expect(groupRow).toMatchSnapshot()

    fireEvent.click(within(groupRow!).getByTestId('expand-icon'))
    await waitFor(() => {
      expect(findRowByText('M9X7')).toBeInTheDocument()
    })

    fireEvent.click(within(findRowByText('M9X7')!).getByTestId('expand-icon'))
    await waitFor(() => {
      expect(findRowByText('Kits')).toBeInTheDocument()
    })
    fireEvent.click(within(findRowByText('Kits')!).getByTestId('expand-icon'))

    await waitFor(() => {
      expect(findRowByText('Foundation Full Foundation Kit')).toMatchSnapshot()
    })

    fireEvent.click(within(findRowByText('Components')!).getByTestId('expand-icon'))

    await waitFor(() => {
      expect(findRowByText('Foundation King Foundation Component')).toMatchSnapshot()
    })

    expect(findRowByText('Foundation Queen Foundation')).toMatchSnapshot()
  })

  test('open rejection panel', async () => {
    render(<Recs />, { wrapper: createWrapper() })

    await loading()

    const row = findRowByText('Foundation')
    expect(row).toBeInTheDocument()

    const swapButton = within(row!).getByRole('button', { name: /approve/i })
    const rejectButton = within(row!).getByRole('button', { name: /reject/i })

    expect(rejectButton).toBeInTheDocument()
    expect(swapButton).toBeInTheDocument()

    fireEvent.click(rejectButton)
    await waitFor(() => {
      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })

    expect(screen.getByText(/please provide a rejection reason/i)).toBeInTheDocument()

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeInTheDocument()
    expect(confirmButton).toBeDisabled()

    const radio = screen.getByRole('radio', { name: /aesthetic issue/i })
    expect(radio).toBeInTheDocument()

    fireEvent.click(radio)
    expect(confirmButton).not.toBeDisabled()

    expect(screen.getByText(/additional notes/i)).toBeInTheDocument()
    expect(screen.getByText(/add a note as to why you’re rejecting this recommendation/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })
  })

  test('live view', async () => {
    render(<Recs />, { wrapper: createWrapper() })

    await loading()

    fireEvent.click(screen.getByRole('button', { name: /live view/i }))
    await waitFor(() => {
      expect(screen.getByText(/live view/i)).toBeInTheDocument()
    })

    expect(
      screen.getByText(/this list consists of all the existing series and products that are currently on the floor\./i)
    ).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByText('074 ASHLEY HOMESTORE - BRENTWOOD')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    await waitFor(
      () => {
        expect(screen.getByText('8 Inch Bonnell Hybrid')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )

    const row = findRowByText('8 Inch Bonnell Hybrid')

    expect(row).toMatchSnapshot()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('heading', { name: /live view/i })).not.toBeInTheDocument()
  })
})
