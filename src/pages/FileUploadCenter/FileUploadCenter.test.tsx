import { type FC, type ReactNode } from 'react'
import { random } from '@arteli/utils'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { users } from '$/mocks/data/users'
import IntlProvider from '@/components/IntlProvider'
import { userJobs } from '@/mocks/data/userJobs'
import { handlers } from '@/mocks/handlers'
import { PATH_FILE_UPLOAD_CENTER } from '@/routes'
import { SessionProvider } from '@/store/Session'
import getDesignTokens from '@/theme'
import FileUploadCenter from '.'

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
                initialEntries={[`/upload-center`]}
                future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
              >
                <Routes>
                  <Route path={PATH_FILE_UPLOAD_CENTER} element={children}></Route>
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

const loading = async () => {
  await waitFor(
    () => {
      expect(screen.queryAllByRole('row')).toHaveLength(2)
    },
    { timeout: 2_000 }
  )
}

describe('FileUploadCenter', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  const findRowByText = (text: string) =>
    screen.queryAllByRole('row').find((row) => within(row).queryAllByText(text).length !== 0)

  const expectRowToHaveText = (row: HTMLElement, text: string) =>
    expect(within(row).getByText(text)).toHaveTextContent(text)

  test('renders page', async () => {
    render(<FileUploadCenter />, { wrapper: createWrapper() })

    await loading()

    expect(screen.getByText('Data Center')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Customize the application by configuring views and data. You can download example files and upload new data for modifications. Only the most recent file of each type will be used.'
      )
    ).toBeInTheDocument()

    const row = findRowByText(userJobs[0].processingStatus)
    expectRowToHaveText(row!, users[0].name)

    expect(screen.getByRole('button', { name: /upload product tags/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /select merge strategy/i }))
    expect(screen.getByRole('menuitem', { name: /upload product tags/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /upload sister series/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitem', { name: /upload sister series/i }))

    expect(screen.queryByRole('button', { name: /upload sister series/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /upload product flags/i })).not.toBeInTheDocument()
  })

  test('download csv', async () => {
    render(<FileUploadCenter />, { wrapper: createWrapper() })

    await loading()

    const href = `https://arteli.com/${random.String}.csv`
    const createObjectURL = vi.fn(() => href)

    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = vi.fn()

    const BlobMock = vi.fn(function (content: string, options: unknown) {
      return { content, options }
    })

    global.Blob = BlobMock as unknown as typeof Blob

    const row = findRowByText(userJobs[0].processingStatus)

    const button = within(row!).getByRole('button')

    fireEvent.click(button)

    await waitFor(() => {
      expect(BlobMock).toHaveBeenCalled()
    })

    expect(BlobMock.mock?.lastCall?.[0]).toMatchSnapshot()
  })
})
