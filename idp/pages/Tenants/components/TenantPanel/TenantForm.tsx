import { useMemo } from 'react'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import * as yup from 'yup'
import { TenantFlags, type Tenant } from '$/api/system'
import { defaultTimeZone } from './timezones'
import { TimezoneSelect } from './TimezoneSelect'

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const messages = defineMessages({
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  create: { defaultMessage: 'Create', id: 'VzzYJk' },
  update: { defaultMessage: 'Update', id: 'BWpuKl' },
  internalId: { defaultMessage: 'Internal Id', id: 'dNg4LC' },
  flags: { defaultMessage: 'Flags', id: 'Ed112w' },
  required: { defaultMessage: 'Required', id: 'Seanpx' },
  invalidInternalId: { defaultMessage: 'Invalid Internal Id', id: 'XoeG97' }
})

const useTenantValidationSchema = () => {
  const { formatMessage: t } = useIntl()

  return useMemo(
    () =>
      yup.object({
        name: yup.string().required(t(messages.required)),
        internalId: yup.string().uuid(t(messages.invalidInternalId)).required(t(messages.required))
      }),
    [t]
  )
}

export type TenantFormFields = Omit<Tenant, 'id'>

export function TenantForm({
  onSubmit,
  initialValues,
  variant = 'create'
}: {
  onSubmit: (values: TenantFormFields) => void
  initialValues?: Partial<TenantFormFields>
  variant?: 'create' | 'update'
}) {
  const { formatMessage: t } = useIntl()
  const validationSchema = useTenantValidationSchema()

  const formik = useFormik<TenantFormFields>({
    enableReinitialize: true,
    initialValues: {
      labels: {},
      name: '',
      internalId: '',
      defaultTimeZone,
      isActive: true,
      flags: TenantFlags.None,
      ...initialValues
    },
    validationSchema,
    onSubmit
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="name"
        name="name"
        label={t(messages.name)}
        size="small"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      <Separator />
      <FormControlLabel
        control={
          <Switch
            value={formik.values.isActive}
            checked={formik.values.isActive}
            onChange={formik.handleChange}
            name="isActive"
            id="isActive"
            onBlur={formik.handleBlur}
            edge="start"
          />
        }
        label={t(messages.active)}
        labelPlacement="end"
        sx={{ margin: 0 }}
      />
      <Separator />
      <TimezoneSelect
        timezone={formik.values.defaultTimeZone}
        onChange={(timezone) => formik.setFieldValue('defaultTimeZone', timezone)}
      />

      {variant === 'create' && (
        <>
          <Separator />
          <TextField
            fullWidth
            id="internalId"
            name="internalId"
            label={t(messages.internalId)}
            size="small"
            value={formik.values.internalId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.internalId && Boolean(formik.errors.internalId)}
            helperText={formik.touched.internalId && formik.errors.internalId}
          />
        </>
      )}

      <Separator />
      <Button variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
        <FormattedMessage {...(variant === 'create' ? messages.create : messages.update)} />
      </Button>
    </form>
  )
}
