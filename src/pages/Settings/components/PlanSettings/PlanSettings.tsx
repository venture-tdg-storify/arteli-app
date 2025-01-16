import type { TenantSettingsUpdate } from '@/api/arteli'
import { useMemo } from 'react'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import * as yup from 'yup'
import api from '@/api'
import { useSession } from '@/hooks/useSession'
import { toast } from '@/store/notifications'
import { settings } from '@/store/settings'

const useTenantSettingsQuery = api.Arteli.TenantSettings.get.asQuery()
const useTenantUpdate = api.Arteli.TenantSettings.update.asMutation()

const DEFAULT_ACTION_OVERDUE_DAYS = 30

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const messages = defineMessages({
  auditSettings: { defaultMessage: 'Plan Settings', id: 'KKaaFq' },
  auditSettingsHint: {
    defaultMessage:
      'Set the timeframe to capture any overdue swaps. This is tracked in the Audit report on the Dashboard.',
    id: '2AquY5'
  },
  save: { defaultMessage: 'Save', id: 'jvo0vs' },
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  minValue: { defaultMessage: 'Minimum value is 1', id: 'pXrH4d' },
  days: { defaultMessage: 'days', id: 'Bc20la' },
  companySettingsUpdated: { defaultMessage: 'Company settings updated successfully', id: 'APsPPZ' }
})

const useSettingsValidationSchema = () => {
  const { formatMessage: t } = useIntl()

  return useMemo(
    () =>
      yup.object({
        actionOverdueDays: yup.number().required(t(messages.required)).min(1, t(messages.minValue))
      }),
    [t]
  )
}

export type TenantFormFields = TenantSettingsUpdate

export const PlanSettings = () => {
  const { tenantUserId } = settings.use()
  const { me } = useSession()
  const tenantId = me?.tenantUsers.find((_) => _.id === tenantUserId)?.tenantId

  const { formatMessage: t } = useIntl()

  const queryClient = useQueryClient()

  const { data: tenantSettings, isLoading } = useTenantSettingsQuery({ params: { id: tenantId }, enabled: !!tenantId })

  const onSettled = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tenants'] })
  }

  const { mutate: update, isPending: updatingSettings } = useTenantUpdate({
    onSettled,
    onSuccess: () => {
      toast.Success(t(messages.companySettingsUpdated))
    }
  })

  const formik = useFormik<Pick<TenantFormFields, 'actionOverdueDays'>>({
    enableReinitialize: true,
    initialValues: {
      actionOverdueDays: DEFAULT_ACTION_OVERDUE_DAYS,
      ...tenantSettings
    },
    validationSchema: useSettingsValidationSchema(),
    onSubmit: (values) => {
      update({
        params: { id: tenantId! },
        body: {
          ...tenantSettings!,
          actionOverdueDays: values.actionOverdueDays
        }
      })
    }
  })

  if (isLoading || !tenantSettings) {
    return
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography
        component="h1"
        variant="h4"
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 30, mb: 1 })}
      >
        <FormattedMessage {...messages.auditSettings} />
      </Typography>
      <Typography marginBottom={4}>
        <FormattedMessage {...messages.auditSettingsHint} />
      </Typography>
      <Separator />
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="start" mb={1}>
        <TextField
          type="number"
          id="actionOverdueDays"
          name="actionOverdueDays"
          size="small"
          value={formik.values.actionOverdueDays}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.actionOverdueDays && Boolean(formik.errors.actionOverdueDays)}
          helperText={formik.touched.actionOverdueDays && formik.errors.actionOverdueDays}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FormattedMessage {...messages.days} />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" type="submit" size="small" disabled={formik.isSubmitting || updatingSettings}>
          <FormattedMessage {...messages.save} />
        </Button>
      </Stack>
    </form>
  )
}
