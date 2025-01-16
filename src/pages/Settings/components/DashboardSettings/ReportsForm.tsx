import type { TenantSettingsPowerBiReport, TenantSettingsUpdate } from '@/api/arteli'
import { useCallback, useMemo, useState } from 'react'
import { random } from '@arteli/utils'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import * as yup from 'yup'
import ConfirmModal from '@/components/ConfirmModal'

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const messages = defineMessages({
  save: { defaultMessage: 'Save', id: 'jvo0vs' },
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  reportName: { defaultMessage: 'Power BI Report Name', id: '+k4EkD' },
  reportUrl: { defaultMessage: 'Power BI Report URL', id: 'x5x3HY' },
  linkDescription: {
    defaultMessage:
      'This link does not appear to link to a Power BI report. Improper links could prevent the app from operating correctly. Are you sure you want to add this link?',
    id: 'xOod3G'
  },
  invalidUrl: { defaultMessage: 'URL must be fully qualified and begin with http:// or https://.', id: 'idDg41' }
})

const useReportValidationSchema = () => {
  const { formatMessage: t } = useIntl()

  return useMemo(
    () =>
      yup.object({
        name: yup.string().required(t(messages.required)),
        // TODO: Pattern https://app.powerbi.com/reportEmbed?
        url: yup.string().url(t(messages.invalidUrl)).required(t(messages.required))
      }),
    [t]
  )
}

export type ReportsFormFields = Pick<TenantSettingsUpdate, 'powerBiReports'>

const emptyReport: TenantSettingsPowerBiReport = { name: '', url: '' }

export function ReportsForm({
  onSubmit,
  initialValues,
  disabled
}: {
  onSubmit: (values: ReportsFormFields) => void
  initialValues?: ReportsFormFields
  disabled?: boolean
}) {
  const [values, setValues] = useState<TenantSettingsPowerBiReport | null>(null)
  const { formatMessage: t } = useIntl()
  const powerBiReports = useMemo(() => {
    return (initialValues?.powerBiReports ?? []).map((report) => ({ ...report, id: random.String }))
  }, [initialValues])

  const handleSubmit = useCallback(
    (values: TenantSettingsPowerBiReport) => {
      onSubmit({ powerBiReports: [...powerBiReports, values] })
    },
    [onSubmit, powerBiReports]
  )

  const formikReport = useFormik<TenantSettingsPowerBiReport>({
    enableReinitialize: true,
    initialValues: emptyReport,
    validationSchema: useReportValidationSchema(),
    onSubmit: (values) => {
      if (values.url.includes('app.fabric.microsoft.com') || values.url.includes('app.powerbi.com')) {
        handleSubmit(values)
        formikReport.resetForm()
      } else {
        setValues(values)
      }
    }
  })

  const handleOnFinalize = useCallback(() => {
    if (values) {
      handleSubmit(values!)
      setValues(null)
    }
    formikReport.resetForm()
  }, [formikReport, handleSubmit, values])

  return (
    <>
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
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="start" mb={1}>
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
          <Button variant="contained" type="submit" size="small" disabled={formikReport.isSubmitting || disabled}>
            <FormattedMessage {...messages.save} />
          </Button>
        </Stack>
      </form>
      <ConfirmModal
        title={null}
        description={t(messages.linkDescription)}
        open={Boolean(values)}
        onClose={() => setValues(null)}
        onCancel={() => setValues(null)}
        onConfirm={handleOnFinalize}
        inverted
      />
    </>
  )
}
