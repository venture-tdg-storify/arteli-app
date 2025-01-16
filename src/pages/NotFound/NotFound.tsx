import Button from '@mui/material/Button'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Link } from 'react-router-dom'
import ErrorMessage from '@/components/ErrorMessage'

const messages = defineMessages({
  errorFallback: { defaultMessage: '404 - Page not found', id: 'C7zbxT' },
  goToHome: { defaultMessage: 'Go to Home Page', id: 'XeadAV' }
})

export const NotFound = () => {
  return (
    <ErrorMessage
      action={
        <Button variant="outlined" sx={{ mt: 2, width: 200 }} LinkComponent={Link} href="/">
          <FormattedMessage {...messages.goToHome} />
        </Button>
      }
    >
      <FormattedMessage {...messages.errorFallback} />
    </ErrorMessage>
  )
}
