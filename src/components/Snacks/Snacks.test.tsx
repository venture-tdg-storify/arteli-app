import { act } from 'react'
import { random } from '@arteli/utils'
import { render, screen } from '@testing-library/react'
import { toast } from '@/store/notifications'
import Snacks from '.'

describe('Snacks', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders error', async () => {
    const message = random.String
    const onClose = vi.fn()
    toast.Error(message, { timeout: 1e4, onClose })

    render(<Snacks />)

    expect(screen.queryByText(message)).toBeInTheDocument()

    act(() => vi.runAllTimers())

    expect(screen.queryByText(message)).not.toBeInTheDocument()

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('renders info', async () => {
    const message = random.String

    toast.Info(message)

    render(<Snacks />)

    expect(screen.queryByText(message)).toBeInTheDocument()

    act(() => vi.runAllTimers())

    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })

  test('renders success', async () => {
    const message = random.String

    toast.Success(message)

    render(<Snacks />)

    expect(screen.queryByText(message)).toBeInTheDocument()

    act(() => vi.runAllTimers())

    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })

  test('renders warning', async () => {
    const message = random.String

    toast.Warning(message)

    render(<Snacks />)

    act(() => vi.runAllTimers())

    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })
})
