import { useCallback, useRef, useState } from 'react'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled, useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { NavLink, useNavigate } from 'react-router-dom'
import SidePanel from '@/components/SidePanel'
import { useVisibleTags } from '@/hooks/useVisibleTags'
import { PATH_SETTINGS_RECOMMENDATIONS } from '@/routes'
import { AddFilters } from './AddFilters'
import { RemoveFilters } from './RemoveFilters'

const Container = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(2, 2, 0, 2),
  overflow: 'auto'
}))

function a11yProps(index: number) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const messages = defineMessages({
  businessMonitor: { defaultMessage: 'Business Monitor', id: 'ac2/NU' },
  description: { defaultMessage: 'Customized filters for Recommendations', id: '6FqAnw' },
  add: { defaultMessage: 'Add', id: '2/2yg+' },
  remove: { defaultMessage: 'Remove', id: 'G/yZLu' }
})

export function BusinessMonitor() {
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const { formatMessage: t } = useIntl()

  const { addFlags, removeFlags } = useVisibleTags()

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onExit = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const ref = useRef<HTMLDivElement>(null)

  return (
    <SidePanel
      onClose={onClose}
      onExit={onExit}
      title={<FormattedMessage {...messages.businessMonitor} />}
      open={open}
      ref={ref}
      zIndex={theme.zIndex.modal + 2147483647}
    >
      <Container>
        <Stack sx={{ mt: 1, mb: 3 }}>
          <Typography>
            <FormattedMessage {...messages.description} />
          </Typography>
          <IconButton component={NavLink} to={PATH_SETTINGS_RECOMMENDATIONS}>
            <Icon className="fa-gear" />
          </IconButton>
        </Stack>
        <Tabs value={activeTab} onChange={handleChange} aria-label="action tabs" sx={{ marginTop: 2 }}>
          <Tab label={t(messages.add)} sx={{ minHeight: 48, height: 48 }} {...a11yProps(0)} />
          <Tab label={t(messages.remove)} sx={{ minHeight: 48, height: 48 }} {...a11yProps(1)} />
        </Tabs>
        {activeTab === 0 && <AddFilters tags={addFlags} />}
        {activeTab === 1 && <RemoveFilters productTags={removeFlags} />}
      </Container>
    </SidePanel>
  )
}
