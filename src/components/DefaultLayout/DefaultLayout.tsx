import { Suspense } from 'react'
import { styled } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import Header from '@/components/Header'
import { ErrorFallback } from '../ErrorFallback/ErrorFallback'
import Loader from '../Loader'
const Wrapper = styled('div')(() => ({ minWidth: 800 }))

export function DefaultLayout() {
  return (
    <>
      <Header />
      <Wrapper>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Wrapper>
    </>
  )
}
