import { random } from '@arteli/utils'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import IntlProvider from '@/components/IntlProvider'
import Modal from '.'

describe('Modal', () => {
  test('renders', async () => {
    const title = random.String
    const description = random.String
    const body = random.String

    render(
      <Modal onClose={vi.fn()} open={true} title={title} description={description}>
        {body}
      </Modal>,
      { wrapper: IntlProvider }
    )

    expect(screen.queryByText(title)).toBeInTheDocument()
    expect(screen.queryByText(description)).toBeInTheDocument()
    expect(screen.queryByText(body)).toBeInTheDocument()
  })

  test('calls onClose', async () => {
    const onClose = vi.fn()

    render(<Modal onClose={onClose} open={true} title={random.String} description={random.String} />, {
      wrapper: IntlProvider
    })

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(onClose).toBeCalled()
  })

  test('hides', async () => {
    const title = random.String

    render(<Modal onClose={vi.fn()} open={false} title={title} description={random.String} />, {
      wrapper: IntlProvider
    })

    expect(screen.queryByText(title)).not.toBeInTheDocument()
  })
})
