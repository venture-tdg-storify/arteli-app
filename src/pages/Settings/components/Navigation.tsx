import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { useMatch, useNavigate } from 'react-router-dom'
import { PATH_SETTINGS, PATH_SETTINGS_PLAN, PATH_SETTINGS_RECOMMENDATIONS } from '@/routes'
import { SettingsMenuItem } from './SettingsMenuItem'

const messages = defineMessages({
  settings: { defaultMessage: 'Settings', id: 'D3idYv' },
  dashboard: { defaultMessage: 'Dashboard', id: 'hzSNj4' },
  recommendations: { defaultMessage: 'Recommendations', id: 'EnTkxu' },
  plan: { defaultMessage: 'Plan', id: 'fz0z4c' },
  description: { defaultMessage: 'Configurable parameters or options within the application.', id: 'Y4Rn4o' }
})

const Base = styled('div', { name: 'SettingsMenu' })(({ theme: { sizes, spacing } }) => ({
  position: 'fixed',
  left: 0,
  top: sizes.header.height,
  padding: spacing(6, 6),
  width: spacing(41),
  height: `calc(100vh - 64px)`
}))

const selectedTypes = {
  SELECTED_DASHBOARD: 0,
  SELECTED_RECOMMENDATIONS: 1,
  SELECTED_PLAN: 2
}

const useSelected = () => {
  const tabs = [
    { value: selectedTypes.SELECTED_DASHBOARD, active: [useMatch(PATH_SETTINGS)] },
    { value: selectedTypes.SELECTED_RECOMMENDATIONS, active: [useMatch(PATH_SETTINGS_RECOMMENDATIONS)] },
    { value: selectedTypes.SELECTED_PLAN, active: [useMatch(PATH_SETTINGS_PLAN)] }
  ]

  return { selected: tabs.find((tab) => tab.active.some((match) => Boolean(match)))?.value ?? false }
}

export const Navigation = () => {
  const navigate = useNavigate()
  const { selected } = useSelected()
  const { formatMessage: t } = useIntl()

  const handleNavigateLink = (route: string) => {
    navigate({ pathname: route, search: location.search })
  }

  return (
    <>
      <Base>
        <Typography
          component="h1"
          variant="h4"
          sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 30, mb: 2 })}
        >
          <FormattedMessage {...messages.settings} />
        </Typography>
        <Typography>
          <FormattedMessage {...messages.description} />
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 3 }} dense>
          <SettingsMenuItem
            text={t(messages.dashboard)}
            selected={selected === selectedTypes.SELECTED_DASHBOARD}
            onClick={() => handleNavigateLink(PATH_SETTINGS)}
          />
          <SettingsMenuItem
            text={t(messages.recommendations)}
            selected={selected === selectedTypes.SELECTED_RECOMMENDATIONS}
            onClick={() => handleNavigateLink(PATH_SETTINGS_RECOMMENDATIONS)}
          />
          <SettingsMenuItem
            text={t(messages.plan)}
            selected={selected === selectedTypes.SELECTED_PLAN}
            onClick={() => handleNavigateLink(PATH_SETTINGS_PLAN)}
          />
        </List>
      </Base>
    </>
  )
}
