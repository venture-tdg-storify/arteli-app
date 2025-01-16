import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useMe } from '@/hooks/useMe'
import { logout } from '@/store/auth'

const messages = defineMessages({
  app: { defaultMessage: 'Arteli App', id: 'IICbdq' },
  logout: { defaultMessage: 'Logout', id: 'C81/uG' }
})

export function UserMenu() {
  const me = useMe()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const goToApp = React.useCallback(() => {
    location.replace('/')
  }, [])

  const logoutWithRedirect = () => logout({ returnTo: window.location.origin })

  return (
    <Box sx={{ ml: 'auto' }}>
      <Button
        aria-label="menu"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
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
        >
          <Icon
            className="fa-solid fa-user"
            sx={(theme) => ({
              color: theme.palette.text.primary
            })}
          />
        </Avatar>
        <Typography
          sx={(theme) => ({
            marginLeft: 1,
            marginRight: 1,
            fontSize: 16,
            color: theme.palette.text.secondary
          })}
        >
          {me?.user.name || ''}
        </Typography>
        {open ? (
          <Icon
            className="fa-caret-up"
            sx={(theme) => ({
              color: theme.palette.text.primary
            })}
          />
        ) : (
          <Icon
            className="fa-caret-down"
            sx={(theme) => ({
              color: theme.palette.text.primary
            })}
          />
        )}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={goToApp}>
          <FormattedMessage {...messages.app} />
        </MenuItem>
        <MenuItem onClick={logoutWithRedirect}>
          <FormattedMessage {...messages.logout} />
        </MenuItem>
      </Menu>
    </Box>
  )
}
