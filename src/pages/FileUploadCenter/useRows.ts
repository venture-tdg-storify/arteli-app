import type { TenantUser, UserJob } from '@/api/types.generated'
import { useEffect, useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import api from '@/api'
import { useUserByIdsQuery } from '@/hooks/arteli'
import { allItemsQuery } from '@/utils/allItemsQuery'

export type Row = {
  user: TenantUser
  userJob: UserJob
}

const useAllUserJobs = allItemsQuery(api.Arteli.UserJob.findAll)

export const useRows = () => {
  const { data: userJobs, isFetching: isFetchingUserJobs } = useAllUserJobs()

  const userIds = useMemo(() => userJobs?.map((_) => _.createdById) ?? [], [userJobs])

  const { data: users, isFetching: isFetchingUsers } = useUserByIdsQuery({
    params: { ids: userIds },
    enabled: Boolean(userIds.length)
  })

  const [rows, setRows] = useState<Row[]>([])

  const isFetching = isFetchingUsers || isFetchingUserJobs

  useEffect(() => {
    if (isFetching || !users || !userJobs) {
      return
    }

    const usersById = groupById(users)

    setRows(userJobs.map((userJob) => ({ user: usersById[userJob.createdById], userJob })))
  }, [userJobs, isFetching, users])

  return { rows, isFetching }
}
