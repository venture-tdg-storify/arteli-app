import { act } from 'react'
import { render, screen } from '@testing-library/react'
import IntlProvider from '@/components/IntlProvider'
import ErrorPage from '.'

describe('ErrorPage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', { value: { replace: vi.fn() } })

    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  test('renders', async () => {
    render(<ErrorPage />, { wrapper: IntlProvider })

    expect(screen.queryByText('Something went wrong, reloading the page in 5 seconds')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByText('Something went wrong, reloading the page in 4 seconds')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(window.location.replace).toHaveBeenCalledWith('/')
  })
})
