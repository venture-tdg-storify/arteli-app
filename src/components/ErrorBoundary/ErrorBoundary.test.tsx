import { random } from '@arteli/utils'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '.'

describe('ErrorBoundary', () => {
  test('display content', async () => {
    const message = random.String

    render(<ErrorBoundary fallback={<div>Fallback</div>}>{message}</ErrorBoundary>)

    expect(screen.queryByText(message)).toBeInTheDocument()
  })

  test('shows fallback', async () => {
    const fallback = random.String

    const ThrowableComponent = () => {
      throw new Error(random.String)
    }

    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowableComponent />
      </ErrorBoundary>
    )

    expect(screen.queryByText(fallback)).toBeInTheDocument()

    expect(console.error).toHaveBeenCalled()
  })
})
