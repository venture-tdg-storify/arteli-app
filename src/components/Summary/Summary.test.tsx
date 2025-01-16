import { random } from '@arteli/utils'
import { render, screen } from '@testing-library/react'
import IntlProvider from '@/components/IntlProvider'
import { Summary } from './Summary'

describe('Summary', () => {
  const title = random.String
  const label = random.String
  const emptyTitle = random.String

  test('renders empty', async () => {
    render(
      <Summary
        total={0}
        count={0}
        isFetching={false}
        predictedImpact={0}
        title={<p>{title}</p>}
        label={<p>{label}</p>}
        emptyTitle={<p>{emptyTitle}</p>}
      >
        <div />
      </Summary>,
      { wrapper: IntlProvider }
    )

    expect(screen.getByText(emptyTitle)).toBeInTheDocument()
  })

  test('renders', async () => {
    render(
      <Summary
        total={1}
        count={1}
        isFetching={false}
        predictedImpact={1100}
        title={<p>{title}</p>}
        label={<p>{label}</p>}
        emptyTitle={<p>{emptyTitle}</p>}
      >
        <div />
      </Summary>,
      { wrapper: IntlProvider }
    )
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(/total estimated impact/i)).toBeInTheDocument()
    expect(screen.getByText('$1,100')).toBeInTheDocument()
    expect(screen.queryByText(emptyTitle)).not.toBeInTheDocument()
  })
})
