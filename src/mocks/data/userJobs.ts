import type { UserJob } from '@/api/types.generated'
import { users } from '$/mocks/data/users'
import { getByProperty } from '@/utils'

export const userJobs: UserJob[] = [
  {
    id: '1.UJ.4g',
    type: 'ProductFlagsCsv',
    processingStatus: 'Completed',
    processingStatusChangedAt: null,
    errors: [],
    createdById: users[0].id,
    createdAt: '2024-06-18T16:50:40.691+00:00',
    name: 'awesome.csv'
  }
]

export const getUserJobById = getByProperty(userJobs, 'id')
