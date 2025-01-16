import type { ActionSet, TenantUser } from '@/api/arteli'
import { useMemo, useEffect, useState } from 'react'
import { groupById } from '@arteli/utils'
import { useAllActionSets, useUserByIdsQuery } from '@/hooks/arteli'

export type Row = {
  user: TenantUser | null
  actionSet: ActionSet
}

export function useRows() {
  const { data: actionSets, isFetching: isFetchingActionSets } = useAllActionSets({
    params: { statuses: ['Finalized'] }
  })

  const userIds = useMemo(() => actionSets?.map((_) => _.updatedById) ?? [], [actionSets])

  const { data: users, isFetching: isFetchingUsers } = useUserByIdsQuery({
    params: { ids: userIds },
    enabled: Boolean(userIds.length)
  })

  const [rows, setRows] = useState<Row[]>([])

  const isFetching = isFetchingUsers || isFetchingActionSets

  useEffect(() => {
    if (isFetching || !users || !actionSets) {
      return
    }

    const usersById = groupById(users)

    setRows(
      actionSets.map((actionSet) => ({
        user: actionSet.finalizedById ? usersById[actionSet.finalizedById] : null,
        actionSet
      }))
    )
  }, [actionSets, isFetching, users])

  return { rows, isFetching }
}
