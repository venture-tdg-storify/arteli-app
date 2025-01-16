import React, { useEffect, useRef } from 'react'
import { FormattedMessage, FormattedRelativeTime, defineMessages } from 'react-intl'
import ErrorMessage from '@/components/ErrorMessage'

const messages = defineMessages({
  errorFallback: { defaultMessage: 'Something went wrong, reloading the page {time}', id: '0KO8gf' }
})

export const ErrorFallback: React.FC = () => {
  const interval = useRef<number>()
  const [time, setTime] = React.useState(Number(import.meta.env.VITE_ERROR_FALLBACK_TIMEOUT))

  const clearInterval = () => {
    window.clearInterval(interval.current)
  }

  useEffect(() => {
    interval.current = window.setInterval(() => {
      setTime((prev) => prev - 1)
    }, 1000)

    return clearInterval
  }, [])

  useEffect(() => {
    if (time === 0) {
      clearInterval()
      window.location.replace('/')
    }
  }, [time])

  return (
    <ErrorMessage>
      <FormattedMessage
        {...messages.errorFallback}
        values={{ time: <FormattedRelativeTime value={time} numeric="auto" /> }}
      />
    </ErrorMessage>
  )
}
