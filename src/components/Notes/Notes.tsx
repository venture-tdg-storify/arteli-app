import React from 'react'
import Button from '@mui/material/Button'
import styled from '@mui/material/styles/styled'
import TextField from '@mui/material/TextField'
import { FormattedMessage, useIntl, FormattedDate, FormattedTime, defineMessages } from 'react-intl'

export type NoteBody = {
  user: {
    id: string
    name: string
  }
  note: string
}

export type Note = {
  id: string
  recommendationId: string
  createdAt: string
} & NoteBody

type NotesProps = {
  onAddNote: (text: string) => void
  notes: Note[]
}

const MainWrapper = styled('div', { name: 'notes-main-wrapper' })(({ theme: { spacing } }) => ({
  padding: spacing(2, 0)
}))

const TextareaWrapper = styled('div')(({ theme: { palette, spacing } }) => ({
  padding: spacing(0),
  display: 'flex',
  flexDirection: 'column',
  '& > div:nth-of-type(1)': {
    fontSize: 14,
    color: palette.text.tertiary
  },
  '& > div:nth-of-type(3)': {
    textAlign: 'right'
  }
}))

const NotesWrapper = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(2, 0)
}))

const NoteWrapper = styled('div')(({ theme: { palette, spacing } }) => ({
  padding: spacing(2, 0),
  borderBottom: '1px solid rgba(241, 243, 245, 1)',
  '& > div:nth-of-type(1)': {
    fontSize: 14,
    color: palette.text.quaternary
  },
  '& > div:nth-of-type(2)': {
    padding: spacing(2, 0),
    fontSize: 16,
    color: palette.text.tertiary
  },
  '& > div:nth-of-type(3)': {
    color: palette.text.quaternary,
    textAlign: 'right',
    fontSize: 14
  }
}))

const messages = defineMessages({
  postComment: { defaultMessage: 'Post Comment', id: 'iNaZxq' },
  addAComment: { defaultMessage: 'Add a comment here', id: 'DfP6AQ' }
})

export const Notes: React.FC<NotesProps> = ({ onAddNote, notes }) => {
  const [text, setText] = React.useState('')
  const { formatMessage: t } = useIntl()

  const handleAddNote = () => {
    onAddNote?.(text)
    setText('')
  }

  return (
    <MainWrapper>
      <TextareaWrapper>
        <TextField
          multiline
          minRows={5}
          placeholder={t({ ...messages.postComment })}
          maxRows={10}
          variant="standard"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <Button
            onClick={handleAddNote}
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={text.trim().length === 0}
          >
            <FormattedMessage {...messages.postComment} />
          </Button>
        </div>
      </TextareaWrapper>
      <NotesWrapper>
        {notes.map((note) => (
          <NoteWrapper key={note.id}>
            <div>{note.user.name}</div>
            <div>{note.note}</div>
            <div>
              <FormattedDate value={note.createdAt} /> <FormattedTime value={note.createdAt} />
            </div>
          </NoteWrapper>
        ))}
      </NotesWrapper>
    </MainWrapper>
  )
}
