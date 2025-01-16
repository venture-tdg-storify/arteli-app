import type { FC, ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { vi } from 'vitest'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
import getDesignTokens from '@/theme'
import GroupSearch from '.'

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
          <IntlProvider>{children}</IntlProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

const server = setupServer(...handlers)
const onSetId = vi.fn()

describe('GroupSearch', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterAll(async () => {
    server.close()
  })

  test('renders', async () => {
    render(<GroupSearch onSetId={onSetId} isFetchingRecs={false} />, { wrapper: createWrapper() })

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Search Series Name, Series ID')

    fireEvent.change(input, { target: { value: 'A' } })
    await waitFor(() => {
      expect(screen.getByText(/type more characters\.\./i)).toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: 'Adj' } })
    await waitFor(() => {
      expect(screen.getByText(/searching.../i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(onSetId).toBeCalledWith(['103.G.co'])
      expect(screen.queryByText(/searching.../i)).not.toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: 'Adjj' } })
    await waitFor(() => {
      expect(onSetId).toBeCalledWith([])
      expect(screen.getByText(/your search for "adjj" did not match any series\./i)).toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: '' } })
    await waitFor(() => {
      expect(onSetId).toBeCalledWith(null)
    })
  })
})
