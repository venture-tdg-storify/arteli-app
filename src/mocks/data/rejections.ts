import type { Rejection } from '@/api/arteli'
import { users } from '$/mocks/data/users'
import { getByProperty } from '@/utils'

export const rejections: Rejection[] = [
  {
    id: '3.R.Sk',
    createdAt: '2024-04-26T08:00:45.639178+00:00',
    createdById: users[1].id,
    actionSetId: '2.AS.0J',
    categoryId: '3.C.TW',
    subcategoryId: null,
    groupId: '2.G.co',
    storeId: '12.S.9e',
    reason: 'Discontinued',
    actionType: 'Add'
  }
]

export const getRejectionById = getByProperty(rejections, 'id')
