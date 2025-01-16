import type { ReactNode } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'

const messages = defineMessages({
  show: { defaultMessage: 'Show', id: 'K7AkdL' },
  hide: { defaultMessage: 'Hide', id: 'VA/Z1S' }
})

export const Section = ({ showSlot, hideSlot }: { showSlot: ReactNode; hideSlot: ReactNode }) => {
  return (
    <>
      <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 2, mt: 3 }}>
        <FormattedMessage {...messages.show} />
      </Typography>
      {showSlot}
      <Divider sx={{ my: 3 }} />
      <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 2 }}>
        <FormattedMessage {...messages.hide} />
      </Typography>
      {hideSlot}
    </>
  )
}
