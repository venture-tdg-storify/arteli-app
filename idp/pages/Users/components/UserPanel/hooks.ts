import { useMemo } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import * as yup from 'yup'

const messages = defineMessages({
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  invalidEmail: { defaultMessage: 'Invalid email', id: 'ByuOj8' }
})

export const useUserValidationSchema = () => {
  const { formatMessage: t } = useIntl()

  return useMemo(
    () =>
      yup.object({
        name: yup.string().required(t(messages.required)),
        email: yup.string().email(t(messages.invalidEmail)).required(t(messages.required))
      }),
    [t]
  )
}
