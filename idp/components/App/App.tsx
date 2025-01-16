import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { defineMessages, useIntl } from 'react-intl'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DefaultLayout from '$/components/DefaultLayout'
import routes from '$/routes'
import Loader from '@/components/Loader'
import Snacks from '@/components/Snacks'
import { useSettings } from '@/hooks/useSettings'
import { toast } from '@/store/notifications'
import getDesignTokens from '@/theme'
import ErrorPage from './ErrorPage'

const ReactQueryDevtoolsProduction = lazy(() =>
  // eslint-disable-next-line import/no-unresolved
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools
  }))
)

const messages = defineMessages({
  somethingWentWrong: { defaultMessage: 'Something went wrong', id: 'JqiqNj' }
})

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <DefaultLayout />,
      errorElement: <ErrorPage />,
      children: routes
    }
  ],
  {
    basename: '/idp',
    future: {
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
      v7_fetcherPersist: true
    }
  }
)

declare global {
  interface Window {
    toggleDevtools?: () => void
  }
}

export function App() {
  const [showDevtools, setShowDevtools] = useState(false)
  const { isDarkMode } = useSettings()
  const { formatMessage: t } = useIntl()

  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  const theme = useMemo(() => {
    return createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light'))
  }, [isDarkMode])

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: !Number(import.meta.env.VITE_FLAG_DISABLE_REFETCH_ON_WINDOW_FOCUS)
            // retry: false,
            // staleTime: 60_000
          }
        },
        queryCache: new QueryCache({
          onError: (error) => {
            Sentry.captureException(error)
            console.error(error)
            toast.Error(t(messages.somethingWentWrong))
          }
        })
      }),
    [t]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
        <Snacks />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
