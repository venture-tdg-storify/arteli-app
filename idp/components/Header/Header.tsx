import { Logo } from '@arteli/icons'
import AppBar from '@mui/material/AppBar'
import Link from '@mui/material/Link'
import styled from '@mui/material/styles/styled'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useIntl, defineMessages } from 'react-intl'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'
import { PATH_CREATE, PATH_HOME, PATH_USERS, PATH_USER_ID } from '$/routes'
import { GlobalLoader } from '@/components/PageHeader/GlobalLoader'
import { UserMenu } from './UserMenu'

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
const TAB_USERS = 1

const useActiveTab = () => {
  const tabs = [
    { value: TAB_USERS, active: Boolean(useMatch(PATH_USERS)) },
    { value: TAB_USERS, active: Boolean(useMatch(`${PATH_USERS}/${PATH_USER_ID}`)) },
    { value: TAB_USERS, active: Boolean(useMatch(`${PATH_USERS}/${PATH_CREATE}`)) },
    { value: TAB_DASHBOARD, active: Boolean(useMatch(PATH_HOME)) }
  ]

  return { activeTab: tabs.find((tab) => tab.active)?.value ?? false }
}

const messages = defineMessages({
  tenants: { defaultMessage: 'Companies', id: '3IInif' },
  users: { defaultMessage: 'Customers', id: 'TkYZBT' },
  about: { defaultMessage: 'About', id: 'g5pX+a' }
})

export function Header() {
  const { formatMessage: t } = useIntl()
  const { activeTab } = useActiveTab()
  const navigate = useNavigate()

  return (
    <>
      <AppBar
        role="navigation"
        position="fixed"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.lightBlue,
          // borderBottom: `1px solid ${theme.palette.divider}`,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          padding: theme.spacing(0, 9),
          boxShadow: 'none'
        })}
      >
        <Gradient />
        <Link to={PATH_HOME} component={NavLink} sx={(theme) => ({ height: 24, paddingTop: theme.spacing(0.25) })}>
          <Logo />
        </Link>

        <Tabs
          value={activeTab}
          // onChange={handleTabChange}
          aria-label="header tabs"
          variant="fullWidth"
          sx={(theme) => ({
            marginLeft: theme.spacing(9),
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
          <Tab label={t(messages.tenants)} {...a11yProps(0)} onClick={() => navigate(PATH_HOME)} />
          <Tab label={t(messages.users)} {...a11yProps(1)} onClick={() => navigate(PATH_USERS)} />
        </Tabs>

        <UserMenu />
      </AppBar>
      <GlobalLoader />
      <Placeholder aria-hidden />
    </>
  )
}
