import type { User } from '$/api/system'
import { useCallback, useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import { defineMessages, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import SidePanel from '@/components/SidePanel'
import { CreateUser } from './CreateUser'
import { UpdateUser } from './UpdateUser'

const Container = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(4),
  overflow: 'auto'
}))

const messages = defineMessages({
  editUser: { defaultMessage: 'Edit Customer', id: '1we+05' },
  createUser: { defaultMessage: 'Create Customer', id: 'i4V6L9' }
})

export function UserPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const { userId } = useParams<{ userId: User['id'] }>()
  const { formatMessage: t } = useIntl()

  const onClose = useCallback(() => setOpen(false), [])

  const onExit = useCallback(() => {
    navigate('../')
  }, [navigate])

  const ref = useRef<HTMLDivElement>(null)
  const title = userId ? t(messages.editUser) : t(messages.createUser)

  return (
    <SidePanel onClose={onClose} onExit={onExit} title={title} open={open} ref={ref} size="small">
      <Container>{userId ? <UpdateUser userId={userId} close={onClose} /> : <CreateUser close={onClose} />}</Container>
    </SidePanel>
  )
}
