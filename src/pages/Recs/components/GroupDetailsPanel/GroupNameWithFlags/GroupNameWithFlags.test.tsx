import { random } from '@arteli/utils'
import { render, screen } from '@testing-library/react'
import { ProductFlags } from '@/api/arteli'
import IntlProvider from '@/components/IntlProvider'
import { GroupNameWithFlags } from './GroupNameWithFlags'

describe('Summary', () => {
  const name = random.String

  test('renders name only', async () => {
    render(<GroupNameWithFlags name={name} flags={[]} />, { wrapper: IntlProvider })
    expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.queryByText('New')).not.toBeInTheDocument()
    expect(screen.queryByText('Exclusive')).not.toBeInTheDocument()
  })

  test('renders flags', async () => {
    render(
      <GroupNameWithFlags
        name={name}
        flags={[ProductFlags.New, ProductFlags.Exclusive]}
        tags={['Planned Drop', 'Discontinued']}
      />,
      {
        wrapper: IntlProvider
      }
    )
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Exclusive')).toBeInTheDocument()
    expect(screen.getByText('Planned Drop, Discontinued')).toBeInTheDocument()
  })
})
