import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import * as Sentry from '@sentry/react'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error)
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
