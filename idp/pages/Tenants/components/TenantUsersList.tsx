import { useCallback, useEffect, useMemo, useState } from 'react'
import { groupById } from '@arteli/utils'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import api from '$/api'
import { type TenantUser, type User } from '$/api/system'
import { TenantUserRoles } from '$/api/system'
import { PATH_TENANT_USERS } from '$/routes'
import { tenantUserRoleMessages } from '$/utils/userRoleMessages'
import ErrorMessage from '@/components/ErrorMessage'
import { allItemsQuery } from '@/utils/allItemsQuery'

const useAllTenantUsersQuery = allItemsQuery(api.System.TenantUsers.findAll)
const useAllUsersQuery = allItemsQuery(api.System.Users.findAll)

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  numeric: boolean
}

type Row = {
  user: User
  tenantUser: TenantUser
}

const messages = defineMessages({
  id: { defaultMessage: 'Id', id: 'kGGU2D' },
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  inactive: { defaultMessage: 'Inactive', id: '6Tps09' },
  email: { defaultMessage: 'Email', id: 'sy+pv5' },
  roles: { defaultMessage: 'Roles', id: 'c35gM5' },
  noUsers: { defaultMessage: 'Company has no customers added', id: 'kN00UP' }
})

const tenantUserRoles: TenantUserRoles[] = [
  TenantUserRoles.UserManagement,
  TenantUserRoles.Writer,
  TenantUserRoles.FinalizeActionSet,
  TenantUserRoles.DeleteActionSet,
  TenantUserRoles.EmailNotifications,
  TenantUserRoles.TenantSettingsManagement,
  TenantUserRoles.UserJobManagement
]

export function TenantUsersList({ tenantId }: { tenantId?: string }) {
  const { formatMessage: t } = useIntl()
  const {
    data: tenantUsers,
    isFetching: isFetchingTenantUsers,
    isFetched: isFetchedTenantUsers
  } = useAllTenantUsersQuery({
    params: { tenantIds: tenantId ? [tenantId] : undefined }
  })

  const userIds = useMemo(() => {
    return tenantUsers?.map((tenantUser) => tenantUser.userId) ?? []
  }, [tenantUsers])

  const {
    data: users,
    isFetching: isFetchingUsers,
    isFetched: isFetchedUsers
  } = useAllUsersQuery({
    params: { ids: userIds },
    enabled: userIds.length > 0
  })

  const navigate = useNavigate()

  const isFetching = isFetchingTenantUsers || isFetchingUsers
  const isFetched = isFetchedTenantUsers && (isFetchedUsers || userIds.length === 0)

  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    if (isFetching) return

    const usersById = groupById(users ?? []) // TODO: Update to initialValues

    setRows(tenantUsers?.map((tenantUser) => ({ tenantUser, user: usersById[tenantUser.userId] })) ?? [])
  }, [users, tenantUsers, isFetching])

  const handleRowClicked = useCallback(
    (id: User['id']) => {
      navigate(`./${PATH_TENANT_USERS}/${id}`)
    },
    [navigate]
  )

  const headCells: HeadCell[] = useMemo(
    () => [
      { id: 'id', numeric: false, disablePadding: false, label: t(messages.id) },
      { id: 'name', numeric: false, disablePadding: false, label: t(messages.name) },
      { id: 'email', numeric: false, disablePadding: false, label: t(messages.email) },
      { id: 'isActive', numeric: false, disablePadding: false, label: t(messages.active) },
      { id: 'roles', numeric: false, disablePadding: false, label: t(messages.roles) }
    ],
    [t]
  )

  if (!isFetching && isFetched && rows.length === 0) {
    return (
      <ErrorMessage>
        <FormattedMessage {...messages.noUsers} />
      </ErrorMessage>
    )
  }

  return (
    Boolean(rows.length) && (
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map(({ user, tenantUser }) => (
              <TableRow
                key={tenantUser.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                hover
                onClick={() => handleRowClicked(tenantUser.id)}
              >
                <TableCell align="left">{tenantUser.id}</TableCell>
                <TableCell align="left">{user.name}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{tenantUser.isActive ? t(messages.active) : t(messages.inactive)}</TableCell>
                <TableCell align="left">
                  {tenantUserRoles
                    .filter((_) => _ & tenantUser.roles)
                    .map((_) => t(tenantUserRoleMessages[_]))
                    .join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  )
}
