import type { ActionType, Group, RejectionReason } from '@/api/arteli'
import { useCallback, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/api'
import { ConfirmButtons } from '@/components/ConfirmModal'
import { Note } from '@/components/Notes/Note'
import SidePanel from '@/components/SidePanel'
import { useFilters } from '@/hooks/useFilters'
import { useSettings } from '@/hooks/useSettings'
import analytics from '@/utils/analytics'
import { commonMessages } from '@/utils/messages'

const useCreateRejectionMutation = api.Arteli.Rejections.create.asMutation()
const useAddSingleRecNotesMutation = api.Arteli.RecNotes.create.asMutation()

const messages = defineMessages({
  reject: { defaultMessage: 'Reject', id: 'VzIOKf' },
  rejectDescription: { defaultMessage: 'Please provide a rejection reason', id: 'nbZHiD' },
  discontinued: { defaultMessage: 'Discontinued', id: 'vLMLXN' },
  other: { defaultMessage: 'Other', id: '/VnDMl' },
  similar: { defaultMessage: 'Visually similar series already on floor', id: 't9CNct' },
  aestheticIssue: { defaultMessage: 'Aesthetic issue', id: 'TLXdPw' },
  incorrectFloorStatus: { defaultMessage: 'Incorrect floor status', id: '1M0hCw' },
  inventoryIssues: { defaultMessage: 'Inventory issues', id: 'LwimvG' },
  plannedFutureDrop: { defaultMessage: 'Planned future drop', id: 'odj86h' },
  previouslyPerformedPoorly: { defaultMessage: 'Previously performed poorly', id: 'R8NZmL' },
  spaceConstraints: { defaultMessage: 'Space constraints', id: '70lrRr' },
  rejectionSummary: { defaultMessage: 'We will exclude this recommendation for this store.', id: 'PjXdY0' },
  rejectionSummary2: {
    defaultMessage: 'You can always edit and reinstate this Series in the future if things change.',
    id: 'fb63l5'
  },
  doNotShow: { defaultMessage: 'Do not show this again', id: 'ONoNpd' },
  additionalNotes: { defaultMessage: 'Additional notes', id: 'xqG0ln' },
  additionalNotesDescription: {
    defaultMessage: 'Add a note as to why you’re rejecting this recommendation',
    id: 'Gvr+Yp'
  },
  addNote: { defaultMessage: 'Add a note', id: 'dTW4m3' }
})

const rejectTypes: RejectionReason[] = [
  'AestheticIssue',
  'Discontinued',
  'IncorrectFloorStatus',
  'InventoryIssue',
  'PlannedFutureDrop',
  'PreviouslyPerformedPoorly',
  'SpaceConstraints',
  'VisuallySimilarSeriesAlreadyOnFloor',
  'Other'
]

const rejectTypesMap = {
  AestheticIssue: messages.aestheticIssue,
  Discontinued: messages.discontinued,
  IncorrectFloorStatus: messages.incorrectFloorStatus,
  InventoryIssue: messages.inventoryIssues,
  PlannedFutureDrop: messages.plannedFutureDrop,
  PreviouslyPerformedPoorly: messages.previouslyPerformedPoorly,
  SpaceConstraints: messages.spaceConstraints,
  VisuallySimilarSeriesAlreadyOnFloor: messages.similar,
  Other: messages.other
}

const Container = styled('div')(({ theme: { spacing } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing(2),
  overflow: 'auto'
}))

export function RejectionPanel() {
  const { groupId = '', actionType = 'Add' } = useParams<{ groupId: Group['id']; actionType: ActionType }>()
  const [open, setOpen] = useState(true)
  const { storeIds, categoryId, subcategoryIds } = useFilters()
  const navigate = useNavigate()
  const { doNotShowRejectionWarning, setDoNotShowRejectionWarning } = useSettings()
  const [reason, setReason] = useState<RejectionReason | null>(null)
  const [rejected, setRejected] = useState(false)
  const [note, setNote] = useState('')
  const queryClient = useQueryClient()

  const subcategoryId = subcategoryIds[0]

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onExit = useCallback(() => {
    navigate({
      pathname: '../',
      search: location.search
    })
  }, [navigate])

  const { mutate: addNote, isPending: isAddingNotePending } = useAddSingleRecNotesMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rows', 'add-recs'] })
    },
    onSuccess: () => {
      if (doNotShowRejectionWarning) {
        onClose()
      }
      setRejected(true)
    }
  })

  const { mutate: createRejection, isPending } = useCreateRejectionMutation({
    onSuccess: () => {
      if (note.trim().length > 0 && categoryId) {
        addNote({ body: { groupId, content: note, categoryId, subcategoryIds, storeIds } })
      } else {
        if (doNotShowRejectionWarning) {
          onClose()
        }
        setRejected(true)
      }
    }
  })

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value as RejectionReason)
  }, [])

  const handleCreate = useCallback(() => {
    if (reason && groupId && categoryId) {
      analytics?.track('Confirm button on Reject dialog clicked')
      createRejection({
        body: { reason, actionType, groupId, storeIds: storeIds, categoryId, subcategoryId: subcategoryId || null }
      })
    }
  }, [actionType, categoryId, createRejection, groupId, reason, storeIds, subcategoryId])

  const handleClose = useCallback(() => {
    analytics?.track('Cancel button on Reject dialog clicked')
    onClose()
  }, [onClose])

  const handleCheckboxChange = useCallback(() => {
    setDoNotShowRejectionWarning(true)
  }, [setDoNotShowRejectionWarning])

  const ref = useRef<HTMLDivElement>(null)

  if (!groupId) return null

  return (
    <SidePanel
      onClose={onClose}
      onExit={onExit}
      title={<FormattedMessage {...messages.reject} />}
      open={open}
      ref={ref}
    >
      <Container>
        {!rejected && (
          <Box sx={{ width: '100%' }}>
            <Typography fontSize={18}>
              <FormattedMessage {...messages.rejectDescription} />
            </Typography>
            <FormControl sx={{ px: 2, pt: 2 }}>
              <RadioGroup name="radio-buttons-group" value={reason} onChange={handleChange}>
                {rejectTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio sx={{ padding: 1 }} />}
                    label={
                      <Typography fontSize={16}>
                        <FormattedMessage {...rejectTypesMap[type]} />
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Typography fontSize={18} mt={2}>
              <FormattedMessage {...messages.additionalNotes} />
            </Typography>
            <Typography fontSize={14} color="textTertiary">
              <FormattedMessage {...messages.additionalNotesDescription} />
            </Typography>
            <Note onNoteChange={setNote} note={note} placeholder={messages.addNote} />
            <ConfirmButtons
              onCancel={handleClose}
              onConfirm={reason ? handleCreate : undefined}
              confirmLabel={<FormattedMessage {...commonMessages.confirm} />}
              cancelLabel={<FormattedMessage {...commonMessages.cancel} />}
              confirming={isPending || isAddingNotePending}
              inverted
            />
          </Box>
        )}
        {rejected && (
          <Stack direction="column" alignItems="start" padding={2}>
            <Typography fontSize={18}>
              <FormattedMessage {...messages.rejectionSummary} />
            </Typography>
            <Typography fontWeight="bold" fontSize={18}>
              <FormattedMessage {...messages.rejectionSummary2} />
            </Typography>
            <FormControlLabel
              control={<Checkbox size="small" onChange={handleCheckboxChange} />}
              label={
                <Typography variant="overline" sx={{ textTransform: 'capitalize' }}>
                  <FormattedMessage {...messages.doNotShow} />
                </Typography>
              }
            />
          </Stack>
        )}
      </Container>
    </SidePanel>
  )
}
