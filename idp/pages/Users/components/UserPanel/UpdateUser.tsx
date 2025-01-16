import type { UserUpdate } from '$/api/system'
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import api from '$/api'
import { toast } from '@/store/notifications'
import { UserForm } from './UserForm'

const useUserQuery = api.System.Users.findOne.asQuery()
const useUserUpdate = api.System.Users.update.asMutation()

const messages = defineMessages({
  success: { defaultMessage: 'Customer updated successfully', id: 'JRso7r' }
})

export function UpdateUser({ userId, close }: { userId: string; close: () => void }) {
  const { formatMessage: t } = useIntl()
  const { data: user, isLoading } = useUserQuery({ params: { id: userId } })
  const queryClient = useQueryClient()

  const { mutate: update } = useUserUpdate({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      close()
    }
  })

  const updateTenant = useCallback(
    async (values: Partial<UserUpdate>) => {
      if (!user?.id) return

      update({ params: { id: user.id }, body: values as UserUpdate }) // TODO: Check with BE why fields are not optional
    },
    [update, user]
  )

  if (isLoading) return null

  return user && <UserForm onSubmit={updateTenant} variant="update" initialValues={user} />
}
