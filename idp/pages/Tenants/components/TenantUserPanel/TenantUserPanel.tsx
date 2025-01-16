import type { TenantUser } from '$/api/system'
import { useCallback, useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import { defineMessages, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import SidePanel from '@/components/SidePanel'
import { CreateTenantUser } from './CreateTenantUser'
import { UpdateTenantUser } from './UpdateTenantUser'

const Container = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(4),
  overflow: 'auto'
}))

const messages = defineMessages({
  edit: { defaultMessage: 'Edit Company Customer', id: 'rjTmh9' },
  add: { defaultMessage: 'Add Customer To Company', id: 'Y+QR8X' }
})

export function TenantUserPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const { tenantUserId } = useParams<{ tenantUserId: TenantUser['id'] }>()
  const { formatMessage: t } = useIntl()

  const onClose = useCallback(() => setOpen(false), [])

  const onExit = useCallback(() => {
    navigate('../')
  }, [navigate])

  const ref = useRef<HTMLDivElement>(null)
  const title = tenantUserId ? t(messages.edit) : t(messages.add)

  return (
    <SidePanel onClose={onClose} onExit={onExit} title={title} open={open} ref={ref} size="small">
      <Container>
        {tenantUserId ? (
          <UpdateTenantUser userId={tenantUserId} close={onClose} />
        ) : (
          <CreateTenantUser close={onClose} />
        )}
      </Container>
    </SidePanel>
  )
}
