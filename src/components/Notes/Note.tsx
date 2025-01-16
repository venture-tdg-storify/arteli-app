import type { MessageDescriptor } from 'react-intl'
import Button from '@mui/material/Button'
import styled from '@mui/material/styles/styled'
import TextField from '@mui/material/TextField'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

const TextareaWrapper = styled('div')(({ theme: { palette, spacing } }) => ({
  padding: spacing(0),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  '& > div:nth-of-type(1)': {
    fontSize: 14,
    color: palette.text.tertiary
  },
  '& > div:nth-of-type(3)': {
    textAlign: 'right'
  },
  width: '100%'
}))

const messages = defineMessages({
  addSwapNote: { defaultMessage: 'Add swap note', id: 'MdFRZs' },
  clear: { defaultMessage: 'Clear', id: '/GCoTA' }
})

export const Note = ({
  onNoteChange,
  note,
  clearable = true,
  placeholder = messages.addSwapNote
}: {
  onNoteChange: (text: string) => void
  note: string
  clearable?: boolean
  placeholder?: MessageDescriptor
}) => {
  const { formatMessage: t } = useIntl()
  const showClearButton = clearable && Boolean(note)

  return (
    <TextareaWrapper>
      {showClearButton && (
        <Button size="small" onClick={() => onNoteChange('')}>
          <FormattedMessage {...messages.clear} />
        </Button>
      )}
      <TextField
        multiline
        minRows={5}
        placeholder={t(placeholder)}
        maxRows={10}
        variant="standard"
        value={note}
        fullWidth
        onChange={(e) => onNoteChange(e.target.value)}
        // sx={{ mt: showClearButton ? 0 : 4 }}
      />
    </TextareaWrapper>
  )
}
