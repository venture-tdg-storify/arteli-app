import type { TenantUserCreate } from '$/api/system'
import type { ReactNode } from 'react'
import { useCallback } from 'react'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import api from '$/api'
import Overline from '@/components/StoreOverline'
import { toast } from '@/store/notifications'
import { TenantUserForm, type TenantUserFormFields } from './TenantUserForm'

const useTenantUserQuery = api.System.TenantUsers.findOne.asQuery()
const useUserQuery = api.System.Users.findOne.asQuery()
const useTenantUserUpdate = api.System.TenantUsers.update.asMutation()

export type UpdateTenantUserForm = Omit<TenantUserCreate, 'userId' | 'tenantId'>

const messages = defineMessages({
  id: { defaultMessage: 'Id', id: 'kGGU2D' },
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  user: { defaultMessage: 'Customer', id: 'hkENym' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  inactive: { defaultMessage: 'Inactive', id: '6Tps09' },
  success: { defaultMessage: 'Customer updated successfully', id: 'JRso7r' },
  email: { defaultMessage: 'Email', id: 'sy+pv5' },
  status: { defaultMessage: 'Status', id: 'tzMNF3' }
})

const Info = ({ value, label }: { label: ReactNode; value?: ReactNode | null }) => (
  <Overline label={label}>
    <Typography sx={({ palette }) => ({ mt: 1, fontSize: 14, color: palette.text.secondary })}>{value}</Typography>
  </Overline>
)

export function UpdateTenantUser({ userId, close }: { userId: string; close: () => void }) {
  const queryClient = useQueryClient()
  const { data: tenantUser } = useTenantUserQuery({ params: { id: userId } })
  const { data: user } = useUserQuery({ params: { id: tenantUser?.userId || '' }, enabled: Boolean(tenantUser?.id) })

  const { mutate: update } = useTenantUserUpdate({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tenant-users'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      close()
    }
  })
  const { formatMessage: t } = useIntl()

  const updateTenant = useCallback(
    async (values: TenantUserFormFields) => {
      if (!tenantUser?.id) return

      update({ params: { id: tenantUser.id }, body: values })
    },
    [update, tenantUser]
  )

  return (
    <>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        <FormattedMessage {...messages.user} />
      </FormLabel>
      <Stack direction="row" sx={{ flexBasis: '50%' }}>
        <Info
          value={<Link to={`/users/${user?.id}`}>{user?.name}</Link>}
          label={<FormattedMessage {...messages.name} />}
        />
        <Info
          value={<FormattedMessage {...(user?.isActive ? messages.active : messages.inactive)} />}
          label={<FormattedMessage {...messages.status} />}
        />
        <Info value={user?.id} label={<FormattedMessage {...messages.id} />} />
      </Stack>
      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Info value={user?.email} label={<FormattedMessage {...messages.email} />} />
      </Stack>
      <Divider sx={{ mb: 2, mt: 2 }} />

      {tenantUser && <TenantUserForm onSubmit={updateTenant} initialValues={tenantUser} variant="update" />}
    </>
  )
}
