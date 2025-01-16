import type { ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, waitForElementToBeRemoved, screen } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { tenantUsers } from '$/mocks/data/tenantUsers'
import IntlProvider from '@/components/IntlProvider'
import { handlers } from '@/mocks/handlers'
import { settings } from '@/store/settings'
import getDesignTokens from '@/theme'
import App from './'

settings.set('tenantUserId', tenantUsers[0].id)
const server = setupServer(...handlers)

const timeout = 10_000
describe(
  'App',
  () => {
    beforeAll(() => {
      server.listen({ onUnhandledRequest: 'error' })
    })

    afterAll(async () => {
      server.close()
    })

    test('works', async () => {
      const Wrapper = ({ children }: { children: ReactNode }) => (
        <IntlProvider>
          <ThemeProvider theme={createTheme(getDesignTokens('light'))}>
            <CssBaseline enableColorScheme />
            {children}
          </ThemeProvider>
        </IntlProvider>
      )

      render(<App />, { wrapper: Wrapper })

      await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'), { timeout })

      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    })
  },
  { timeout }
)
