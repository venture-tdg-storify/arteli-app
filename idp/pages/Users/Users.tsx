import { Suspense, useCallback, useMemo } from 'react'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FormattedDate, defineMessages, useIntl } from 'react-intl'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import api from '$/api'
import { UserRoles, type User } from '$/api/system'
import { systemUserRoleMessages } from '$/utils/systemUserRoleMessages'
import Container from '@/components/Container'
import PageHeader from '@/components/PageHeader'
import { allItemsQuery } from '@/utils/allItemsQuery'

const systemUserRoles = [UserRoles.Staff]

const useAllUsersQuery = allItemsQuery(api.System.Users.findAll)

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  numeric: boolean
}

const messages = defineMessages({
  users: { defaultMessage: 'Customers', id: 'TkYZBT' },
  id: { defaultMessage: 'Id', id: 'kGGU2D' },
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  inactive: { defaultMessage: 'Inactive', id: '6Tps09' },
  internalId: { defaultMessage: 'Internal Id', id: 'dNg4LC' },
  createUser: { defaultMessage: 'Create Customer', id: 'i4V6L9' },
  email: { defaultMessage: 'Email', id: 'sy+pv5' },
  updatedAt: { defaultMessage: 'Updated At', id: 'ECx6bx' },
  permissions: { defaultMessage: 'Permissions', id: 'SFuk1v' }
})

export function Users() {
  const { formatMessage: t } = useIntl()

  const { data: users } = useAllUsersQuery()

  const navigate = useNavigate()

  const handleRowClicked = useCallback(
    (id: User['id']) => {
      navigate(`./${id}`)
    },
    [navigate]
  )

  const headCells: HeadCell[] = useMemo(
    () => [
      { id: 'id', numeric: false, disablePadding: false, label: t(messages.id) },
      { id: 'name', numeric: false, disablePadding: false, label: t(messages.name) },
      { id: 'email', numeric: false, disablePadding: false, label: t(messages.email) },
      { id: 'active', numeric: false, disablePadding: false, label: t(messages.active) },
      { id: 'permissions', numeric: false, disablePadding: false, label: t(messages.permissions) },
      { id: 'updatedAt', numeric: false, disablePadding: false, label: t(messages.updatedAt) }
    ],
    [t]
  )

  return (
    <>
      <TransitionGroup>
        <Suspense>
          <Outlet />
        </Suspense>
      </TransitionGroup>
      <PageHeader title={t(messages.users)}>
        <Button component={Link} to="create" variant="contained" color="primary" sx={{ marginLeft: 'auto' }}>
          {t(messages.createUser)}
        </Button>
      </PageHeader>
      <Container>
        <TableContainer component={Paper}>
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
              {users?.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                  hover
                  onClick={() => handleRowClicked(user.id)}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="left">{user.name}</TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="left" sx={{ color: user.isActive ? 'text.primary' : 'text.quaternary' }}>
                    {t(user.isActive ? messages.active : messages.inactive)}
                  </TableCell>
                  <TableCell align="left">
                    {systemUserRoles
                      .filter((_) => _ & user.roles)
                      .map((_) => t(systemUserRoleMessages[_]))
                      .join(', ') || t(systemUserRoleMessages[UserRoles.None])}
                  </TableCell>
                  <TableCell align="left">
                    <FormattedDate value={user.updatedAt} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}
