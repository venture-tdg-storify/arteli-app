import * as React from 'react'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs_ from '@mui/material/Tabs'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useMatch, useNavigate } from 'react-router-dom'
import {
  PATH_DOWNLOADS,
  PATH_HOME,
  PATH_LIVE_VIEW,
  PATH_PROGRESS_REPORT,
  PATH_REPORTS,
  PATH_SERIES_REPORT
} from '@/routes'

const ButtonContainer = styled('div', { name: 'NavigationControls' })(({ theme: { spacing } }) => ({
  marginRight: spacing(2.5)
}))

const messages = defineMessages({
  reports: { defaultMessage: 'Power BI Reports', id: 'TnmjvL' },
  performance: { defaultMessage: 'Performance', id: 'AA5h7P' },
  audits: { defaultMessage: 'Audits', id: 'tPtCxw' },
  completedPlans: { defaultMessage: 'Completed Plans', id: 'I5WEIp' }
})

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`
  }
}

enum Tabs {
  PERFORMANCE = 0,
  AUDITS = 1,
  DOWNLOADS = 2,
  REPORTS = 3
}

const useActiveTab = () => {
  const tabs = [
    {
      value: Tabs.PERFORMANCE,
      active: [useMatch(PATH_HOME), useMatch(PATH_SERIES_REPORT)].some((match) => Boolean(match))
    },
    { value: Tabs.AUDITS, active: Boolean(useMatch(PATH_PROGRESS_REPORT)) },
    { value: Tabs.AUDITS, active: Boolean(useMatch(PATH_PROGRESS_REPORT + '/' + PATH_LIVE_VIEW)) },
    { value: Tabs.DOWNLOADS, active: Boolean(useMatch(PATH_DOWNLOADS)) },
    { value: Tabs.REPORTS, active: Boolean(useMatch(PATH_REPORTS)) }
  ]

  return { activeTab: tabs.find((tab) => tab.active)?.value ?? false }
}

export const Navigation = React.forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate()
  const { activeTab } = useActiveTab()

  return (
    <Stack sx={{ borderRadius: 1, backgroundColor: '#F5F6F7' }}>
      <Tabs_
        value={activeTab}
        aria-label="dashboard tabs"
        sx={(theme) => ({
          marginRight: 'auto',
          height: 64,
          marginLeft: theme.spacing(0),
          alignItems: 'end',
          justifyContent: 'flex-start',
          width: 820,
          '.MuiTabs-indicator': {
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'white',
            boxShadow: '0px 4px 17.4px 0px rgba(0, 0, 0, 0.12)',
            borderRadius: theme.spacing(0.5),
            border: '1px solid #DEE0E3',
            height: theme.spacing(7)
          },
          '.MuiTab-root': {
            color: theme.palette.text.primary,
            fontWeight: 400,
            backgroundColor: 'unset',
            minWidth: 'fit',
            margin: theme.spacing(0, 2.5),
            zIndex: 2,
            '&.Mui-selected': {
              color: theme.palette.text.primary,
              fontWeight: 600,
              background: 'transparent'
            }
          }
        })}
      >
        <Tab
          label={<FormattedMessage {...messages.performance} />}
          onClick={() => navigate(PATH_HOME)}
          {...a11yProps(Tabs.PERFORMANCE)}
        />
        <Tab
          label={<FormattedMessage {...messages.audits} />}
          onClick={() => navigate(PATH_PROGRESS_REPORT)}
          {...a11yProps(Tabs.AUDITS)}
        />
        <Tab
          label={<FormattedMessage {...messages.completedPlans} />}
          onClick={() => navigate(PATH_DOWNLOADS)}
          {...a11yProps(Tabs.DOWNLOADS)}
        />
        <Tab
          label={<FormattedMessage {...messages.reports} />}
          onClick={() => navigate(PATH_REPORTS)}
          {...a11yProps(Tabs.REPORTS)}
        />
      </Tabs_>
      <ButtonContainer ref={ref} />
    </Stack>
  )
})
