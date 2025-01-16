import { random } from '@arteli/utils'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import IntlProvider from '@/components/IntlProvider'
import ConfirmModal from '.'

describe('ConfirmModal', () => {
  test('renders', async () => {
    const title = random.String
    const description = random.String

    render(
      <ConfirmModal
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        open={true}
        title={title}
        description={description}
      />,
      { wrapper: IntlProvider }
    )

    expect(screen.queryByText(title)).toBeInTheDocument()
    expect(screen.queryByText(description)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  test('calls handlers', async () => {
    const onCancel = vi.fn()
    const onClose = vi.fn()
    const onConfirm = vi.fn()
    const confirmLabel = random.String
    const cancelLabel = random.String

    render(
      <ConfirmModal
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={onClose}
        open={true}
        title={random.String}
        description={random.String}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
      />,
      { wrapper: IntlProvider }
    )

    fireEvent.click(screen.getByRole('button', { name: confirmLabel }))
    expect(onConfirm).toBeCalled()

    fireEvent.click(screen.getByRole('button', { name: cancelLabel }))
    expect(onCancel).toBeCalled()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(onClose).toBeCalled()
  })

  test('hides', async () => {
    const title = random.String

    render(
      <ConfirmModal
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        onClose={vi.fn()}
        open={false}
        title={title}
        description={random.String}
      />,
      { wrapper: IntlProvider }
    )

    expect(screen.queryByText(title)).not.toBeInTheDocument()
  })
})
