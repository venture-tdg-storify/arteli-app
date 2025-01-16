import type { TenantFormFields } from './TenantForm'
import { useCallback } from 'react'
import { HttpError } from '@arteli/http'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import api from '$/api'
import { toast } from '@/store/notifications'
import { TenantForm } from './TenantForm'

const useTenantAdd = api.System.Tenants.add.asMutation()

const messages = defineMessages({
  id: { defaultMessage: 'Id', id: 'kGGU2D' },
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  internalId: { defaultMessage: 'Internal Id', id: 'dNg4LC' },
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  success: { defaultMessage: 'Company added successfully', id: 'uIc2EF' },
  create: { defaultMessage: 'Create', id: 'VzzYJk' },
  somethingWentWrong: { defaultMessage: 'Something went wrong', id: 'JqiqNj' },
  internalIdOrNameAlreadyExists: { defaultMessage: 'Internal Id or Name already exists', id: 'MKPwn4' }
})

export function CreateTenant({ close }: { close: () => void }) {
  const queryClient = useQueryClient()
  const { formatMessage: t } = useIntl()

  const { mutate: add } = useTenantAdd({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      close()
    },
    onError: async (err) => {
      if (err instanceof HttpError) {
        if (err.response.status === 409) {
          toast.Error(t(messages.internalIdOrNameAlreadyExists))

          return
        }

        toast.Error(t(messages.somethingWentWrong))
      }
    }
  })

  const addTenant = useCallback(
    async (values: TenantFormFields) => {
      add({
        body: {
          name: values.name,
          isActive: values.isActive,
          internalId: values.internalId,
          flags: values.flags,
          defaultTimeZone: values.defaultTimeZone,
          labels: {}
        }
      })
    },
    [add]
  )

  return <TenantForm onSubmit={addTenant} />
}
