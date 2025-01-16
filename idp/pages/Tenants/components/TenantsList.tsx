import type { Tenant } from '$/api/system'
import Avatar from '@mui/material/Avatar'
import Fab from '@mui/material/Fab'
import Icon from '@mui/material/Icon'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import api from '$/api'
import { PATH_CREATE } from '$/routes'
import { allItemsQuery } from '@/utils/allItemsQuery'

const messages = defineMessages({
  tenants: { defaultMessage: 'Companies', id: '3IInif' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  inactive: { defaultMessage: 'Inactive', id: '6Tps09' }
})

const useAllTenantsQuery = allItemsQuery(api.System.Tenants.findAll)

const Base = styled('div', { name: 'Container' })(({ theme: { sizes, spacing } }) => ({
  position: 'fixed',
  left: 0,
  top: sizes.header.height,
  width: spacing(50),
  height: `calc(100vh - 64px)`,
  padding: spacing(2),
  borderRight: '1px solid #e0e0e0'
}))

export function TenantsList({
  tenantId,
  onSelectTenant
}: {
  tenantId?: Tenant['id']
  onSelectTenant: (id: Tenant['id']) => void
}) {
  const { formatMessage: t } = useIntl()

  const { data: tenants } = useAllTenantsQuery()

  return (
    <Base>
      <Stack
        sx={({ spacing }) => ({ borderRadius: spacing(1), mb: spacing(1), pl: spacing(1), pr: spacing(1) })}
        direction="column"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Typography
          component="h1"
          sx={({ typography }) => ({ fontSize: 20, fontWeight: typography.fontWeightBold, mr: 1 })}
        >
          {t(messages.tenants)}
        </Typography>
        <Typography sx={({ palette }) => ({ color: palette.text.secondary, fontSize: 12 })}>
          Select company below to manage it
        </Typography>
      </Stack>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} dense>
        {tenants?.map((tenant) => (
          <ListItemButton
            key={tenant.id}
            onClick={() => onSelectTenant(tenant.id)}
            selected={tenantId === tenant.id}
            sx={{ p: 1 }}
          >
            <ListItemAvatar>
              <Tooltip title={t(tenant.isActive ? messages.active : messages.inactive)}>
                <Avatar
                  sx={(theme) => ({
                    bgcolor: tenant.isActive ? theme.palette.text.tertiary : theme.palette.grey[400]
                  })}
                >
                  <Icon className="fa-layer-group" />
                </Avatar>
              </Tooltip>
            </ListItemAvatar>
            <ListItemText
              primary={tenant.name}
              secondary={tenant.internalId}
              secondaryTypographyProps={{
                sx: ({ palette }) => ({ color: palette.text.tertiary, fontSize: 12, mt: 0.5 })
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Fab
        component={Link}
        to={PATH_CREATE}
        color="primary"
        aria-label="add"
        size="medium"
        sx={({ spacing }) => ({ position: 'absolute', bottom: spacing(2), right: spacing(2) })}
      >
        <Icon className="fa-add" />
      </Fab>
    </Base>
  )
}
