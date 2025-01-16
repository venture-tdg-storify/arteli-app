import type { ReportsFormFields } from './ReportsForm'
import type { TenantSettingsPowerBiReport } from '@/api/types.generated'
import React, { useCallback, useMemo } from 'react'
import { random } from '@arteli/utils'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import api from '@/api'
import { useSession } from '@/hooks/useSession'
import { toast } from '@/store/notifications'
import { settings } from '@/store/settings'
import { Report } from './Report'
import { ReportsForm } from './ReportsForm'

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const messages = defineMessages({
  companySettingsUpdated: { defaultMessage: 'Company settings updated successfully', id: 'APsPPZ' },
  reportAdded: { defaultMessage: 'Report added successfully', id: 'blxshY' },
  reportRemoved: { defaultMessage: 'Report removed successfully', id: 'u+bNKc' },
  reportSettings: { defaultMessage: 'Power BI Report Settings', id: 'nZ2YoE' },
  savedReports: { defaultMessage: 'Saved Power BI Reports', id: '6Wb2OJ' },
  reportSettingsHint: {
    defaultMessage:
      'Add Power BI reports that show up on the Dashboard. Only links to Microsoft Power BI reports are supported.',
    id: 'Y6SZ1X'
  },
  seriesPerformanceReport: { defaultMessage: 'Series Performance Report', id: '+0aaUl' },
  seriesPerformanceReportDescription: {
    defaultMessage: 'Configure settings for the Series Performance Report',
    id: 'kLLVKK'
  },
  seeRemoved: { defaultMessage: 'See removed series', id: '69TCJi' }
})

const useTenantSettingsQuery = api.Arteli.TenantSettings.get.asQuery()
const useTenantUpdate = api.Arteli.TenantSettings.update.asMutation()

export const DashboardSettings = () => {
  const { tenantUserId } = settings.use()
  const { me } = useSession()
  const tenantId = me?.tenantUsers.find((_) => _.id === tenantUserId)?.tenantId

  const { formatMessage: t } = useIntl()

  const queryClient = useQueryClient()

  const { data: tenantSettings, isLoading } = useTenantSettingsQuery({ params: { id: tenantId }, enabled: !!tenantId })

  const onSettled = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tenants'] })
  }

  const powerBiReports = useMemo(() => {
    return (tenantSettings?.powerBiReports ?? []).map((report) => ({ ...report, id: random.String }))
  }, [tenantSettings])

  const { mutate: update, isPending: updatingSettings } = useTenantUpdate({
    onSettled,
    onSuccess: () => {
      toast.Success(t(messages.companySettingsUpdated))
    }
  })

  const { mutate: removeReport, isPending: removingReport } = useTenantUpdate({
    onSettled,
    onSuccess: () => {
      toast.Success(t(messages.reportRemoved))
    }
  })

  const { mutate: addReport, isPending: addingReport } = useTenantUpdate({
    onSettled,
    onSuccess: () => {
      toast.Success(t(messages.reportAdded))
    }
  })

  const handleAddReport = useCallback(
    async (values: ReportsFormFields) => {
      addReport({
        params: { id: tenantId! },
        body: { ...tenantSettings!, powerBiReports: values.powerBiReports }
      })
    },
    [tenantId, tenantSettings, addReport]
  )

  const handleReportRemove = (reportId: string) => {
    removeReport({
      params: { id: tenantId! },
      body: {
        ...tenantSettings!,
        powerBiReports: powerBiReports
          .filter((report) => report.id !== reportId)
          .map((report) => ({ name: report.name, url: report.url })),
        recentlyAddedThresholdDays: tenantSettings?.recentlyAddedThresholdDays ?? 30,
        recentlyRemovedThresholdDays: tenantSettings?.recentlyRemovedThresholdDays ?? 30,
        uiConfig: tenantSettings?.uiConfig ?? {}
      }
    })
  }

  const handleReportUpdate = useCallback(
    async (values: TenantSettingsPowerBiReport & { id: string }) => {
      update({
        params: { id: tenantId! },
        body: {
          ...tenantSettings!,
          powerBiReports: powerBiReports.map((report) => (report.id === values.id ? values : report)),
          recentlyAddedThresholdDays: tenantSettings?.recentlyAddedThresholdDays ?? 30,
          recentlyRemovedThresholdDays: tenantSettings?.recentlyRemovedThresholdDays ?? 30,
          uiConfig: tenantSettings?.uiConfig ?? {}
        }
      })
    },
    [powerBiReports, tenantId, tenantSettings, update]
  )

  const handleCheckboxChange = useCallback(
    (_: React.ChangeEvent, checked: boolean) => {
      update({
        params: { id: tenantId! },
        body: {
          ...tenantSettings!,
          powerBiReports: tenantSettings?.powerBiReports ?? [],
          recentlyAddedThresholdDays: tenantSettings?.recentlyAddedThresholdDays ?? 30,
          recentlyRemovedThresholdDays: tenantSettings?.recentlyRemovedThresholdDays ?? 30,
          uiConfig: {
            ...tenantSettings?.uiConfig,
            selectWebApp: {
              ...tenantSettings?.uiConfig?.selectWebApp,
              seriesPerformanceReportUI: {
                ...tenantSettings?.uiConfig?.selectWebApp?.seriesPerformanceReportUI,
                showRemoved: checked
              }
            }
          }
        }
      })
    },
    [tenantId, tenantSettings, update]
  )

  if (isLoading || !tenantSettings) {
    return
  }

  const shouldDisable = updatingSettings || addingReport || removingReport

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 30, mb: 1 })}
      >
        <FormattedMessage {...messages.seriesPerformanceReport} />
      </Typography>
      <Typography marginBottom={2}>
        <FormattedMessage {...messages.seriesPerformanceReportDescription} />
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={tenantSettings?.uiConfig.selectWebApp?.seriesPerformanceReportUI?.showRemoved}
            onChange={handleCheckboxChange}
          />
        }
        label={t(messages.seeRemoved)}
        sx={{ mb: 4 }}
      />

      <Typography
        component="h1"
        variant="h4"
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 30, mb: 1 })}
      >
        <FormattedMessage {...messages.reportSettings} />
      </Typography>
      <Typography marginBottom={4}>
        <FormattedMessage {...messages.reportSettingsHint} />
      </Typography>
      <ReportsForm
        onSubmit={handleAddReport}
        initialValues={{ powerBiReports: tenantSettings.powerBiReports }}
        disabled={shouldDisable}
      />

      {powerBiReports.length > 0 && (
        <>
          <Separator />
          <Divider />
          <Separator />
          <Typography variant="h6" sx={{ mb: 2 }}>
            <FormattedMessage {...messages.savedReports} />
          </Typography>
          <List>
            {powerBiReports.map((report) => (
              <Report
                key={report.id}
                report={report}
                onUpdate={handleReportUpdate}
                onRemove={handleReportRemove}
                shouldDisable={shouldDisable}
              />
            ))}
          </List>
        </>
      )}
    </>
  )
}
