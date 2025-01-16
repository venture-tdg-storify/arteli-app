import type { SelectChangeEvent } from '@mui/material/Select'
import React, { useState, useId, useCallback } from 'react'
import { getSentryEnv } from '@arteli/utils'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import styled from '@mui/material/styles/styled'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useIntl, FormattedMessage, defineMessages } from 'react-intl'
import { useNavigate, useMatch } from 'react-router-dom'
import { TenantUserRoles, UserRoles } from '$/api/system'
import api from '@/api'
import { useMe } from '@/hooks/useMe'
import { useSettings } from '@/hooks/useSettings'
import { useTenantInfo } from '@/hooks/useTenantInfo'
import {
  PATH_ACTIVE_ACTION_SET,
  PATH_FILE_UPLOAD_CENTER,
  PATH_HOME,
  PATH_PROFILE,
  PATH_GROUPS,
  PATH_RECOMMENDATIONS_ADD,
  PATH_REJECT,
  PATH_SETTINGS,
  PATH_DOWNLOADS,
  PATH_PROGRESS_REPORT,
  PATH_MANUAL_SWAP,
  PATH_EDIT_SWAP,
  PATH_EDIT_NOTES,
  PATH_SWAP,
  PATH_BUSINESS_MONITOR
} from '@/routes'
import { logout } from '@/store/auth'
import { toast } from '@/store/notifications'
import analytics from '@/utils/analytics'
import { commonMessages } from '@/utils/messages'
import { RevertDemoModal } from './RevertDemoModal'

const gradientSize = 4

const Gradient = styled('div')(() => ({
  height: gradientSize,
  width: '100%',
  background: 'linear-gradient(90deg, #DAF87E 8.42%, #D1F5FE 91.58%)',
  position: 'absolute',
  top: 0,
  left: 0
}))

const Placeholder = styled('div')(({ theme: { sizes } }) => ({
  height: sizes.header.height
}))

function a11yProps(index: number) {
  return {
    id: `header-tab-${index}`,
    'aria-controls': `header-tabpanel-${index}`
  }
}

const TAB_DASHBOARD = 0
const TAB_RECOMMENDATIONS_ADD = 1
const TAB_ACTIVE_ACTION_SET = 2

const useActiveTab = () => {
  const tabs = [
    {
      value: TAB_RECOMMENDATIONS_ADD,
      active: [
        useMatch(PATH_RECOMMENDATIONS_ADD),
        useMatch(PATH_RECOMMENDATIONS_ADD + '/' + PATH_GROUPS),
        useMatch(PATH_RECOMMENDATIONS_ADD + '/' + PATH_REJECT),
        useMatch(PATH_RECOMMENDATIONS_ADD + '/' + PATH_SWAP),
        useMatch(PATH_RECOMMENDATIONS_ADD + '/' + PATH_SWAP + '/' + PATH_BUSINESS_MONITOR)
      ]
    },
    {
      value: TAB_ACTIVE_ACTION_SET,
      active: [
        useMatch(PATH_ACTIVE_ACTION_SET),
        useMatch(PATH_ACTIVE_ACTION_SET + '/' + PATH_MANUAL_SWAP),
        useMatch(PATH_ACTIVE_ACTION_SET + '/' + PATH_SWAP),
        useMatch(PATH_ACTIVE_ACTION_SET + '/' + PATH_EDIT_SWAP),
        useMatch(PATH_ACTIVE_ACTION_SET + '/' + PATH_EDIT_NOTES),
        useMatch(PATH_ACTIVE_ACTION_SET + '/' + PATH_BUSINESS_MONITOR)
      ]
    },
    {
      value: TAB_DASHBOARD,
      active: [
        useMatch(PATH_HOME),
        useMatch(`${PATH_HOME}/${PATH_DOWNLOADS}`),
        useMatch(`${PATH_HOME}/${PATH_PROGRESS_REPORT}`)
      ]
    }
  ]

  return { activeTab: tabs.find((tab) => tab.active.some((match) => Boolean(match)))?.value ?? false }
}

const messages = defineMessages({
  dashboard: { defaultMessage: 'Dashboard', id: 'hzSNj4' },
  recommendationsAdd: { defaultMessage: 'Recommendations', id: 'EnTkxu' },
  profile: { defaultMessage: 'Profile', id: 'itPgxd' },
  settings: { defaultMessage: 'Settings', id: 'D3idYv' },
  tenantAdmin: { defaultMessage: 'Company Admin', id: 'jfNPwZ' },
  logout: { defaultMessage: 'Logout', id: 'C81/uG' },
  help: { defaultMessage: 'Help', id: 'SENRqu' },
  revertDemo: { defaultMessage: 'Revert Demo', id: '6vi9aj' },
  success: { defaultMessage: 'Demo has been reverted', id: 'CfekdJ' }
})

const demoRevertQuery = api.Arteli.Demo.reset.asMutation()

const isDevEnv = getSentryEnv(location.host) === 'Development'
const isDemoEnv = getSentryEnv(location.host) === 'Demo'

export function Header() {
  const me = useMe()
  const [revertModalOpen, setRevertModalOpen] = useState(false)
  const { formatMessage: t } = useIntl()
  const navigate = useNavigate()
  const { activeTab } = useActiveTab()
  const menuId = useId()
  const { tenantUserId, setTenantUserId } = useSettings()
  const { tenantUser } = useTenantInfo()
  const { isPending: isReverting, mutate: revertDemo } = demoRevertQuery({
    onSuccess: () => {
      setRevertModalOpen(false)
      setAnchorEl(null)
      toast.Success(t(messages.success), { timeout: 3e3, onClose: () => location.reload() })
    }
  })

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null | undefined>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNavigateLink = (route: string) => {
    if (route === PATH_ACTIVE_ACTION_SET && activeTab === TAB_ACTIVE_ACTION_SET) return

    analytics?.track('Header tab clicked', { tab: route })
    navigate({ pathname: route, search: location.search })
    setAnchorEl(null)
  }

  const logoutWithRedirect = () => logout({ returnTo: window.location.origin })

  const handleChangeTenant = (event: SelectChangeEvent) => {
    setTenantUserId(event.target.value as string)
    location.replace('/')
  }

  const goToIdp = useCallback(() => {
    location.replace('/idp/')
  }, [])

  const handleHelpLink = useCallback(() => {
    analytics?.track('Support button clicked')
    window.open('https://arteli.atlassian.net/servicedesk/customer/portal/3/article/109183205', '_blank')
  }, [])

  const handleClickRevert = useCallback(() => {
    revertDemo({})
  }, [revertDemo])

  const isStaff = Boolean(me?.user.roles & UserRoles.Staff)

  const allowDemoReset = isStaff && (isDemoEnv || isDevEnv)

  const handleCloseRevertModal = useCallback(() => {
    setRevertModalOpen(false)
  }, [])

  const handleOpenRevertModal = useCallback(() => {
    setAnchorEl(null)
    setRevertModalOpen(true)
  }, [])

  return (
    <>
      <AppBar
        role="navigation"
        position="fixed"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.lightBlue,
          // borderBottom: `1px solid ${theme.palette.divider}`,
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexDirection: 'row',
          padding: theme.spacing(0, 9),
          boxShadow: 'none'
        })}
      >
        <Gradient />

        <Tabs
          value={activeTab}
          // onChange={handleTabChange}
          aria-label="header tabs"
          variant="fullWidth"
          sx={(theme) => ({
            marginRight: 'auto',
            height: 68,
            alignItems: 'flex-end',
            '.MuiTabs-indicator': {
              top: 'unset',
              bottom: 0,
              backgroundColor: theme.palette.secondary,
              height: 4,
              borderRadius: theme.spacing(25, 25, 0, 0)
            },
            '.MuiTab-root': {
              color: theme.palette.text.primary,
              fontWeight: 400,
              backgroundColor: 'unset',
              minWidth: 'fit-content',
              padding: theme.spacing(0, 2),
              '&.Mui-selected': {
                color: theme.palette.text.primary,
                fontWeight: 600,
                backgroundColor: 'unset'
              }
            }
          })}
        >
          <Tab label={t(messages.dashboard)} {...a11yProps(0)} onClick={() => handleNavigateLink(PATH_HOME)} />
          <Tab
            label={t(messages.recommendationsAdd)}
            {...a11yProps(1)}
            onClick={() => handleNavigateLink(PATH_RECOMMENDATIONS_ADD)}
          />
          <Tab
            label={t(commonMessages.plan)}
            {...a11yProps(2)}
            onClick={() => handleNavigateLink(PATH_ACTIVE_ACTION_SET)}
          />
        </Tabs>

        {(me?.tenantUsers?.length ?? 0) > 1 && (
          <Select value={tenantUserId || me?.tenantUsers[0].id} onChange={handleChangeTenant} size="small">
            {me?.tenantUsers.map((tenantUser, index) => (
              <MenuItem key={tenantUser.id} value={tenantUser.id}>
                {me?.tenants[index]?.name}
              </MenuItem>
            ))}
          </Select>
        )}

        <IconButton
          aria-label="menu"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleClick}
          sx={(theme) => ({
            color: theme.palette.text.primary,
            ':hover': {
              backgroundColor: 'unset'
            }
          })}
        >
          <Avatar
            sx={(theme) => ({
              backgroundColor: theme.palette.background.icon,
              color: theme.palette.primary.main,
              borderRadius: theme.spacing(5)
            })}
            src={me?.user.pictureUrl ?? undefined}
          >
            <Icon className="fa-solid fa-user" sx={(theme) => ({ color: theme.palette.text.primary })} />
          </Avatar>
          <Typography sx={(theme) => ({ ml: 1, mr: 1, fontSize: 16, color: theme.palette.text.secondary })}>
            {me?.user.name || ''}
          </Typography>
          <Icon
            className={open ? 'fa-caret-up' : 'fa-caret-down'}
            sx={(theme) => ({ color: theme.palette.text.primary })}
          />
        </IconButton>

        <Menu
          data-testid="header-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={() => setAnchorEl(null)}
          sx={() => ({ visibility: open ? 'visible' : 'hidden' })}
        >
          <MenuItem onClick={() => handleNavigateLink(PATH_PROFILE)}>
            <FormattedMessage {...messages.profile} />
          </MenuItem>

          {tenantUser && Boolean(tenantUser?.roles & TenantUserRoles.TenantSettingsManagement) && (
            <MenuItem onClick={() => handleNavigateLink(PATH_SETTINGS)}>
              <FormattedMessage {...messages.settings} />
            </MenuItem>
          )}

          <MenuItem onClick={handleHelpLink}>
            <FormattedMessage {...messages.help} />
          </MenuItem>

          {tenantUser && Boolean(tenantUser?.roles & TenantUserRoles.UserJobManagement) && (
            <MenuItem onClick={() => handleNavigateLink(PATH_FILE_UPLOAD_CENTER)}>
              <FormattedMessage {...commonMessages.dataAdminCenter} />
            </MenuItem>
          )}

          <MenuItem onClick={logoutWithRedirect}>
            <FormattedMessage {...messages.logout} />
          </MenuItem>

          {isStaff && <Divider />}

          {isStaff && (
            <MenuItem onClick={goToIdp} sx={{ color: 'text.secondary' }}>
              <FormattedMessage {...messages.tenantAdmin} />
            </MenuItem>
          )}

          {allowDemoReset && <Divider />}

          {allowDemoReset && (
            <MenuItem onClick={handleOpenRevertModal} sx={{ color: 'text.secondary' }} disabled={isReverting}>
              <FormattedMessage {...messages.revertDemo} />
            </MenuItem>
          )}
        </Menu>
      </AppBar>
      <Placeholder aria-hidden />
      <RevertDemoModal
        open={revertModalOpen}
        onClose={handleCloseRevertModal}
        onConfirm={handleClickRevert}
        isPending={isReverting}
      />
    </>
  )
}
