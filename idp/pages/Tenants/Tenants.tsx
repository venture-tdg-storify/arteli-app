import type { Tenant } from '$/api/system'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { defineMessages, useIntl } from 'react-intl'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import api from '$/api'
import { PATH_CREATE, PATH_EDIT, PATH_TENANT_USERS } from '$/routes'
import { allItemsQuery } from '@/utils/allItemsQuery'
import { Summary } from './components/Summary'
import { TenantsList } from './components/TenantsList'
import { TenantUsersList } from './components/TenantUsersList'

const messages = defineMessages({
  tenants: { defaultMessage: 'Companies', id: '3IInif' },
  users: { defaultMessage: 'Customers', id: 'TkYZBT' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  inactive: { defaultMessage: 'Inactive', id: '6Tps09' },
  addUser: { defaultMessage: 'Add Customer', id: 'MDPHxV' }
})

const Fab = styled(IconButton)<IconButtonProps>(({ theme: { spacing, palette, typography } }) => ({
  fontWeight: typography.fontWeightLight,
  padding: spacing(2, 0),
  border: `1px solid ${palette.secondary.main}`,
  width: spacing(5),
  height: spacing(5),
  color: palette.secondary.main,
  marginRight: spacing(2)
}))

const Base = styled('div', { name: 'Container' })(({ theme: { sizes, spacing } }) => ({
  paddingRight: spacing(4),
  paddingLeft: spacing(4),
  marginRight: 0,
  marginLeft: spacing(50),
  height: `calc(100vh - ${sizes.header.height + 1}px)`,
  width: `calc(100vw - ${spacing(50)}px)`,
  overflowY: 'auto',
  position: 'relative'
}))

const useAllTenantsQuery = allItemsQuery(api.System.Tenants.findAll)

export function Tenants() {
  const { formatMessage: t } = useIntl()
  const { tenantId } = useParams()
  const navigate = useNavigate()

  const { data: tenants } = useAllTenantsQuery()

  useEffect(() => {
    if (tenantId || !tenants || !(tenants.length > 0)) return

    // console.log('navigating to tenant', tenants[0].id)
    navigate(`/${tenants[0].id}`, { replace: true })
  }, [tenantId, tenants, navigate])

  const handleSelectTenant = useCallback(
    (tenantId: Tenant['id']) => {
      navigate(`../${tenantId}`, { replace: true })
    },
    [navigate]
  )

  const handleEditTenant = useCallback(() => {
    navigate(`./${PATH_EDIT}`)
  }, [navigate])

  const tenant = useMemo(() => tenants?.find((tenant) => tenant.id === tenantId), [tenantId, tenants])

  return (
    <>
      <TenantsList tenantId={tenantId} onSelectTenant={handleSelectTenant} />
      {tenant && (
        <Base>
          <Summary tenant={tenant}>
            <Fab onClick={handleEditTenant} aria-label="edit">
              <Icon className="fa-pen" />
            </Fab>

            <Button
              component={Link}
              to={`${PATH_TENANT_USERS}/${PATH_CREATE}`}
              variant="contained"
              color="primary"
              sx={{ marginLeft: 'auto' }}
            >
              {t(messages.addUser)}
            </Button>
          </Summary>
          <TenantUsersList tenantId={tenantId} />
        </Base>
      )}
      <TransitionGroup>
        <Suspense>
          <Outlet />
        </Suspense>
      </TransitionGroup>
    </>
  )
}
