import type { TenantSettingsPowerBiReport, TenantSettingsUpdate } from '@/api/arteli'
import { useMemo } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import * as yup from 'yup'

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const ActionBar = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-end'
}))

const messages = defineMessages({
  save: { defaultMessage: 'Save', id: 'jvo0vs' },
  delete: { defaultMessage: 'Delete', id: 'K3r6DQ' },
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  reportName: { defaultMessage: 'Power BI Report Name', id: '+k4EkD' },
  reportUrl: { defaultMessage: 'Power BI Report URL', id: 'x5x3HY' }
})

const useReportValidationSchema = () => {
  const { formatMessage: t } = useIntl()

  return useMemo(
    () =>
      yup.object({
        name: yup.string().required(t(messages.required)),
        // TODO: Pattern https://app.powerbi.com/reportEmbed?
        url: yup.string().url().required(t(messages.required))
      }),
    [t]
  )
}

export type ReportsFormFields = Pick<TenantSettingsUpdate, 'powerBiReports'>

export function ReportForm({
  onUpdate,
  onRemove,
  report,
  disabled
}: {
  onUpdate: (values: TenantSettingsPowerBiReport & { id: string }) => void
  onRemove: (reportId: string) => void
  report: TenantSettingsPowerBiReport & { id: string }
  disabled?: boolean
}) {
  const { formatMessage: t } = useIntl()

  const formikReport = useFormik<TenantSettingsPowerBiReport>({
    enableReinitialize: true,
    initialValues: report,
    validationSchema: useReportValidationSchema(),
    onSubmit: (values) => {
      onUpdate({ ...values, id: report.id })
      formikReport.resetForm()
    }
  })

  const handleRemove = (event: React.MouseEvent) => {
    event.preventDefault()
    onRemove(report.id)
  }

  return (
    <form onSubmit={formikReport.handleSubmit}>
      <TextField
        id="name"
        name="name"
        size="small"
        placeholder={t(messages.reportName)}
        value={formikReport.values.name}
        onChange={formikReport.handleChange}
        onBlur={formikReport.handleBlur}
        error={formikReport.touched.name && Boolean(formikReport.errors.name)}
        helperText={formikReport.touched.name && formikReport.errors.name}
        sx={{ minWidth: 600 }}
      />
      <Separator />
      <TextField
        id="url"
        name="url"
        size="small"
        placeholder={t(messages.reportUrl)}
        value={formikReport.values.url}
        onChange={formikReport.handleChange}
        onBlur={formikReport.handleBlur}
        error={formikReport.touched.url && Boolean(formikReport.errors.url)}
        helperText={formikReport.touched.url && formikReport.errors.url}
        sx={{ minWidth: 600 }}
      />
      <Separator />
      <ActionBar>
        <Button
          variant="outlined"
          type="submit"
          size="small"
          disabled={formikReport.isSubmitting || disabled}
          onClick={handleRemove}
        >
          <FormattedMessage {...messages.delete} />
        </Button>
        <Button
          variant="contained"
          type="submit"
          size="small"
          disabled={formikReport.isSubmitting || disabled}
          sx={{ ml: 1 }}
        >
          <FormattedMessage {...messages.save} />
        </Button>
      </ActionBar>
    </form>
  )
}
