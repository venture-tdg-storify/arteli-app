import { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '$/components/Header'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import { SessionProvider } from '@/store/Session'

const Wrapper = styled('div')(() => ({ minWidth: 800 }))

export function DefaultLayout() {
  const { hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (hash) {
      console.log(hash)
      navigate(hash.replace('#', '/'), { replace: true })
    }
  }, [hash, navigate])

  return (
    <SessionProvider>
      <Header />
      <Wrapper>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Outlet />
        </ErrorBoundary>
      </Wrapper>
    </SessionProvider>
  )
}
