import type { User } from '$/api/system'
import type { TenantUserFormFields } from './TenantUserForm'
import { useCallback, useState } from 'react'
import FormLabel from '@mui/material/FormLabel'
import { useQueryClient } from '@tanstack/react-query'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import api from '$/api'
import { toast } from '@/store/notifications'
import { TenantUserForm } from './TenantUserForm'
import { UserSelect } from './UserSelect'

const useTenantUserAddMutation = api.System.TenantUsers.add.asMutation()

const messages = defineMessages({
  success: { defaultMessage: 'Customer added successfully', id: 'dPaeOh' },
  user: { defaultMessage: 'Customer', id: 'hkENym' }
})

export function CreateTenantUser({ close }: { close: () => void }) {
  const queryClient = useQueryClient()
  const { tenantId } = useParams()
  const { formatMessage: t } = useIntl()
  const [userId, setUserId] = useState<User['id'] | undefined>()

  const { mutate: add } = useTenantUserAddMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tenant-users'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      close()
    }
  })

  const addTenant = useCallback(
    async (values: TenantUserFormFields) => {
      if (!userId) return

      add({ body: { ...values, userId, tenantId: tenantId! } })
    },
    [add, tenantId, userId]
  )

  return (
    <>
      <FormLabel component="legend" sx={{ mb: 1 }}>
        <FormattedMessage {...messages.user} />
      </FormLabel>
      <UserSelect userId={userId} onChange={setUserId} />
      {Boolean(userId) && <TenantUserForm onSubmit={addTenant} />}
    </>
  )
}
