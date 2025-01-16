import { UserRoles, type User } from '$/api/system'
import { getByProperty } from '@/utils'

export const users: User[] = [
  {
    id: '1!U-mhErmw',
    email: 'ivan@arteli.com',
    name: 'Drazen Petrovic',
    isActive: true,
    updatedAt: '2021-08-10T14:00:00Z',
    roles: UserRoles.Staff,
    pictureUrl: null
  },
  {
    id: '2!U-mhErmw',
    email: 'zoran@arteli.com',
    name: 'Aleksa Santic',
    isActive: true,
    updatedAt: '2021-08-10T14:00:00Z',
    roles: UserRoles.Staff,
    pictureUrl: null
  },
  {
    id: '3!U-mhErmw',
    email: 'boris@arteli.com',
    name: 'Boris Bascarevic',
    isActive: true,
    updatedAt: '2021-08-10T14:00:00Z',
    roles: UserRoles.Staff,
    pictureUrl: null
  },
  {
    id: '4!U-mhErmw',
    email: 'milutin@arteli.com',
    name: 'Milutin Ivkovic',
    isActive: true,
    updatedAt: '2021-08-10T14:00:00Z',
    roles: UserRoles.None,
    pictureUrl: null
  },
  {
    id: '5!U-mhErmw',
    email: 'jovan@arteli.com',
    name: 'Jovan Nisic',
    isActive: false,
    updatedAt: '2021-08-10T14:00:00Z',
    roles: UserRoles.Staff,
    pictureUrl: null
  }
]

export const getUserById = getByProperty(users, 'id')
