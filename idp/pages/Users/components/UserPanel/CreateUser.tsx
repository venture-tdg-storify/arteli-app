import { useCallback } from 'react'
// import { HttpError } from '@arteli/http'
import { HttpError } from '@arteli/http'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import api from '$/api'
import { type UserCreate } from '$/api/system'
import { toast } from '@/store/notifications'
import { UserForm } from './UserForm'

const useUserAddMutation = api.System.Users.add.asMutation()

const messages = defineMessages({
  success: { defaultMessage: 'Customer added successfully', id: 'dPaeOh' },
  somethingWentWrong: { defaultMessage: 'Something went wrong', id: 'JqiqNj' }
})

export function CreateUser({ close }: { close: () => void }) {
  const { formatMessage: t } = useIntl()
  const queryClient = useQueryClient()

  const { mutate: add } = useUserAddMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      close()
    },
    onError: async (err) => {
      if (err instanceof HttpError) {
        const response = (await err.response.json()) || {}
        const error = response?.errors?.userCreate?.[0] || response.title || t(messages.somethingWentWrong)

        toast.Error(error)
      }
    }
  })

  const addTenant = useCallback(
    async (values: UserCreate) => {
      add({ body: values })
    },
    [add]
  )

  return <UserForm onSubmit={addTenant} />
}
