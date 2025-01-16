import type { OutletContext } from './OutletContext'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useState } from 'react'
import Icon from '@mui/material/Icon'
import Link_ from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { createPortal } from 'react-dom'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Link, useOutletContext } from 'react-router-dom'
import { TenantUserRoles } from '$/api/types.generated'
import api from '@/api'
import { useSession } from '@/hooks/useSession'
import { settings } from '@/store/settings'

const useTenantSettingsQuery = api.Arteli.TenantSettings.get.asQuery()

const IFrame = styled('iframe')(({ theme: { sizes, spacing } }) => ({
  height: `calc(100vh - ${sizes.header.height + 1}px - ${sizes.pageHeader.height}px)`,
  width: '100%',
  overflowY: 'auto',
  position: 'relative',
  marginTop: spacing(4),
  border: 'none'
}))

const NoReports = styled('div')(({ theme: { spacing } }) => ({
  fontSize: 14,
  border: '1px solid rgba(116, 132, 151, 1)',
  borderRadius: spacing(2),
  padding: '12px 20px',
  color: '#748497',
  fontWeight: 'bold'
}))

const messages = defineMessages({
  noReports: { defaultMessage: 'No reports saved', id: 'sexlTX' },
  clickHere: { defaultMessage: 'Click to setup reports', id: 'cgy/iM' }
})

export default function Reports() {
  const { buttonContainerRef } = useOutletContext<OutletContext>()
  const { me } = useSession()
  const { tenantUserId } = settings.use()
  const tenantUser = me?.tenantUsers.find((tu) => tu.id === tenantUserId)
  const tenantId = me?.tenantUsers.find((_) => _.id === tenantUserId)?.tenantId
  const [reportIndex, setReportIndex] = useState<number>(0)

  const { data: tenantSettings, isLoading } = useTenantSettingsQuery({ params: { id: tenantId }, enabled: !!tenantId })

  const handleChange = (event: SelectChangeEvent) => {
    setReportIndex(Number(event.target.value))
  }

  const powerBiReports = tenantSettings?.powerBiReports ?? []
  const report = powerBiReports[reportIndex]

  if (isLoading) return

  return (
    <>
      {buttonContainerRef?.current &&
        powerBiReports.length > 0 &&
        createPortal(
          <Select value={reportIndex.toString()} label="" size="small" onChange={handleChange}>
            {powerBiReports.map((report, index) => (
              <MenuItem value={index.toString()} key={index}>
                {report.name}
              </MenuItem>
            ))}
          </Select>,
          buttonContainerRef.current
        )}

      {powerBiReports.length === 0 && (
        <Stack justifyContent="center" width="100%">
          <Stack
            sx={({ sizes }) => ({
              justifyContent: 'center',
              flexDirection: 'column',
              height: `calc(100vh - ${sizes.header.height + 1}px - ${sizes.pageHeader.height + 1}px - 72px)`
            })}
          >
            <NoReports>
              <Icon className="fa-hourglass-clock" sx={{ mr: 1 }} /> <FormattedMessage {...messages.noReports} />
            </NoReports>
            {tenantUser && Boolean(tenantUser?.roles & TenantUserRoles.TenantSettingsManagement) && (
              <Link_
                component={Link}
                to="/settings"
                sx={{ color: 'rgba(68, 68, 68, 1)', textDecorationColor: 'rgba(68, 68, 68, 1)', mt: 1 }}
              >
                <FormattedMessage {...messages.clickHere} />
              </Link_>
            )}
          </Stack>
        </Stack>
      )}
      {report && <IFrame title={report?.name} src={report?.url} allowFullScreen></IFrame>}
    </>
  )
}
