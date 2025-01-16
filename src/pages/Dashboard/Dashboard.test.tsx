import { type FC, type ReactNode } from 'react'
import { random } from '@arteli/utils'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import IntlProvider from '@/components/IntlProvider'
import { actionSets } from '@/mocks/default.scenario'
import { handlers } from '@/mocks/handlers'
import { PATH_DOWNLOADS, PATH_HOME, PATH_PROGRESS_REPORT } from '@/routes'
import { SessionProvider } from '@/store/Session'
import { settings } from '@/store/settings'
import getDesignTokens from '@/theme'
import ActionSetList from './components/ActionSetList'
import HistoricalSwaps from './components/HistoricalSwaps'
import Reports from './components/Reports'
import Dashboard from '.'

const navigate = vi.fn()

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...mod,
    useNavigate: () => navigate
  }
})

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
                  <Route path={PATH_HOME} element={children}>
                    <Route index Component={Reports} />
                    <Route path={PATH_PROGRESS_REPORT} Component={HistoricalSwaps} />
                    <Route path={PATH_DOWNLOADS} Component={ActionSetList} />
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

const loading = async (noOfRows: number) => {
  await waitFor(
    () => {
      expect(screen.queryAllByRole('row')).toHaveLength(noOfRows)
    },
    { timeout: 5_000 }
  )
}

settings.set('tenantUserId', tenantUsers[0].id)
const server = setupServer(...handlers)

describe('Dashboard', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  test('renders', async () => {
    render(<Dashboard />, { wrapper: createWrapper({ path: '' }) })

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  const findRowByText = (text: string) =>
    screen.queryAllByRole('row').find((row) => within(row).queryAllByText(text).length !== 0)

  const expectRowToHaveText = (row: HTMLElement, text: string) =>
    expect(within(row).getByText(text)).toHaveTextContent(text)

  test('progress report', async () => {
    render(<Dashboard />, { wrapper: createWrapper({ path: PATH_PROGRESS_REPORT }) })

    await loading(20)

    expect(screen.queryByText(/audits/i)).toBeInTheDocument()
    expect(screen.getByText(/view the status of approved swaps./i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument()

    let row = findRowByText('079 ASHLEY HOMESTORE - BRANDON (4)')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Needs Attention')

    row = findRowByText('Head-Foot Model Better')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Overdue (as of 6/8/2024)')

    row = findRowByText('080 ASHLEY HOMESTORE - WPG WEST (2)')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Completed')

    row = findRowByText('206 ASHLEY HOMESTORE - GUELPH (5)')
    expect(row).toBeInTheDocument()
    expectRowToHaveText(row!, 'Needs Attention')

    const textboxes = screen.getAllByRole('textbox')
    // search
    expect(textboxes[2]).toHaveValue('')

    fireEvent.change(textboxes[2], { target: { value: 'H' } })
    await waitFor(
      () => {
        expect(screen.getByText(/type more characters\.\./i)).toBeInTheDocument()
      },
      { timeout: 2_000 }
    )

    fireEvent.change(textboxes[2], { target: { value: 'Head-Foot Model Better' } })
    await waitFor(
      () => {
        expect(screen.queryAllByRole('row')).toHaveLength(4)
      },
      { timeout: 2_000 }
    )

    fireEvent.change(textboxes[2], { target: { value: 'xyz' } })
    await waitFor(
      () => {
        expect(screen.getByText(/your search for "xyz" did not match any series\./i)).toBeInTheDocument()
      },
      { timeout: 2_000 }
    )

    fireEvent.change(textboxes[2], { target: { value: '' } })
    await waitFor(
      () => {
        expect(screen.queryAllByRole('row')).toHaveLength(20)
      },
      { timeout: 2_000 }
    )

    expect(textboxes[0]).toHaveValue('04/23/2024')
    fireEvent.change(textboxes[0], { target: { value: '01/1/2024' } })

    expect(textboxes[1]).toHaveValue('04/24/2024')
    fireEvent.change(textboxes[1], { target: { value: '01/2/2024' } })

    expect(
      screen.getByRole('heading', {
        name: /no swaps exist for the selected date range/i
      })
    ).toBeInTheDocument()
  })

  test('downloads and navigates', async () => {
    render(<Dashboard />, { wrapper: createWrapper({ path: PATH_DOWNLOADS }) })

    await loading(3)

    const href = `https://arteli.com/${random.String}.csv`
    const createObjectURL = vi.fn(() => href)

    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = vi.fn()

    const BlobMock = vi.fn(function (content: string, options: unknown) {
      return { content, options }
    })

    global.Blob = BlobMock as unknown as typeof Blob

    const button = screen.getByRole('button', { name: /plan/i })

    fireEvent.click(button)

    await waitFor(() => {
      expect(BlobMock).toHaveBeenCalledWith([JSON.stringify(actionSets.Finalized)])
    })

    const row = screen.queryAllByRole('row').find((row) => within(row).queryAllByText('April 2024').length !== 0)
    expectRowToHaveText(row!, 'Aleksa Santic')
    expectRowToHaveText(row!, '4/24/2024') // finalized date
    expectRowToHaveText(row!, '6/8/2024') // overdue date (45 days threshold

    fireEvent.mouseEnter(screen.getByText('April 2024'))
    await waitFor(() => {
      expect(within(row!).getByTestId('edit-icon')).toBeVisible()
    })

    fireEvent.click(within(row!).getByTestId('edit-icon'))

    expect(screen.getByText(/edit plan/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /plan name/i })).toHaveValue('April 2024')
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Done/i })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: /plan name/i }), { target: { value: '' } })
    expect(screen.getByText(/required/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /done/i })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByText(/edit plan/i)).not.toBeInTheDocument()
  })
})
