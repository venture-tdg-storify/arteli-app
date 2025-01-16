import type { Tenant } from '$/api/system'
import { useCallback, useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import { defineMessages, useIntl } from 'react-intl'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { PATH_EDIT, PATH_TENANT_ID } from '$/routes'
import SidePanel from '@/components/SidePanel'
import { CreateTenant } from './CreateTenant'
import { UpdateTenant } from './UpdateTenant'

const Container = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(6),
  overflow: 'auto'
}))

const messages = defineMessages({
  editTenant: { defaultMessage: 'Edit Company', id: 'bQzZsL' },
  addTenant: { defaultMessage: 'Add Company', id: 'IVHKFh' }
})

export function TenantPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const { tenantId } = useParams<{ tenantId: Tenant['id'] }>()
  const { formatMessage: t } = useIntl()

  const isEdit = Boolean(useMatch(`${PATH_TENANT_ID}/${PATH_EDIT}`))

  const onClose = useCallback(() => setOpen(false), [])

  const onExit = useCallback(() => {
    navigate('../')
  }, [navigate])

  const ref = useRef<HTMLDivElement>(null)
  const title = isEdit ? t(messages.editTenant) : t(messages.addTenant)

  return (
    <SidePanel onClose={onClose} onExit={onExit} title={title} open={open} ref={ref}>
      <Container>
        {isEdit ? <UpdateTenant tenantId={tenantId!} close={onClose} /> : <CreateTenant close={onClose} />}
      </Container>
    </SidePanel>
  )
}
