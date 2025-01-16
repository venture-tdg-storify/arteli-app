import type { ActionSet } from '@/api/arteli'
import dayjs from 'dayjs'
import { users } from '$/mocks/data/users'

export const Response = <T>(items: T[]): T[] => items

export const actionSets: Record<ActionSet['status'], ActionSet> = {
  Started: {
    id: '2.AS.0J',
    createdById: users[0].id,
    updatedById: users[1].id,
    status: 'Started',
    createdAt: dayjs().subtract(2, 'weeks').toISOString(),
    updatedAt: dayjs().subtract(2, 'weeks').toISOString(),
    finalizedAt: null,
    overdueDays: 30,
    name: 'Current',
    finalizedById: null
  },
  Finalized: {
    id: '1.AS.0J',
    createdById: users[0].id,
    updatedById: users[0].id,
    status: 'Finalized',
    createdAt: '2024-04-23T14:26:41.047675+00:00',
    updatedAt: '2024-04-24T12:31:34.384032+00:00',
    finalizedAt: '2024-04-24T12:31:34.384032+00:00',
    overdueDays: 45,
    name: 'April 2024',
    finalizedById: users[1].id
  }
}
