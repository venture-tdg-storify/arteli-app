import type { TenantUpdate } from '$/api/types.generated'
import type { TenantFormFields } from './TenantForm'
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import api from '$/api'
import { toast } from '@/store/notifications'
import { TenantForm } from './TenantForm'

const useTenantQuery = api.System.Tenants.findOne.asQuery()
const useTenantUpdate = api.System.Tenants.update.asMutation()

const messages = defineMessages({
  success: { defaultMessage: 'Company updated successfully', id: '9C+lr2' }
})

export function UpdateTenant({ tenantId, close }: { tenantId: string; close: () => void }) {
  const queryClient = useQueryClient()
  const { formatMessage: t } = useIntl()

  const { data, isLoading } = useTenantQuery({ params: { id: tenantId } })

  const { mutate: update } = useTenantUpdate({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      close()
    }
  })

  const updateTenant = useCallback(
    async (values: TenantFormFields) => {
      update({
        params: { id: tenantId },
        body: {
          name: values.name,
          isActive: values.isActive,
          defaultTimeZone: values.defaultTimeZone
        } as TenantUpdate // TODO: Check with BE why fields are not optional
      })
    },
    [update, tenantId]
  )

  if (isLoading) return null

  return <TenantForm onSubmit={updateTenant} initialValues={data} variant="update" />
}
