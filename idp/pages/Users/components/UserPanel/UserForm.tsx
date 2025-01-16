import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { UserRoles, type User } from '$/api/system'
import { systemUserRoleMessages } from '$/utils/systemUserRoleMessages'
import { useUserValidationSchema } from './hooks'

const systemUserRoles = [UserRoles.Staff]

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(2)
}))

const messages = defineMessages({
  name: { defaultMessage: 'Name', id: 'HAlOn1' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  create: { defaultMessage: 'Create', id: 'VzzYJk' },
  update: { defaultMessage: 'Update', id: 'BWpuKl' },
  email: { defaultMessage: 'Email', id: 'sy+pv5' },
  roles: { defaultMessage: 'Roles', id: 'c35gM5' },
  systemUserWarning: { defaultMessage: 'Warning: This customer will have access to all companies.', id: '97Zb9C' }
})

export type UserFormFields = Pick<User, 'isActive' | 'name' | 'roles' | 'email'>

export function UserForm({
  onSubmit,
  initialValues,
  variant = 'create'
}: {
  onSubmit: (values: UserFormFields) => void
  initialValues?: Partial<UserFormFields>
  variant?: 'create' | 'update'
}) {
  const { formatMessage: t } = useIntl()
  const validationSchema = useUserValidationSchema()

  const formik = useFormik<UserFormFields>({
    enableReinitialize: true,
    initialValues: { name: '', email: '', isActive: true, roles: UserRoles.None, ...initialValues },
    validationSchema,
    onSubmit
  })

  const isSystemUser = Boolean(formik.values.roles & UserRoles.Staff)

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
      <TextField
        fullWidth
        id="email"
        name="email"
        label={t(messages.email)}
        size="small"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
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

      <FormLabel component="legend" sx={{ mb: 1 }}>
        <FormattedMessage {...messages.roles} />
      </FormLabel>
      <FormGroup>
        {systemUserRoles.map((role) => (
          <FormControlLabel
            key={role}
            control={
              <Checkbox
                name="roles"
                value={role}
                checked={Boolean(formik.values.roles & role)}
                onChange={(_, value) => {
                  formik.setFieldValue('roles', value ? formik.values.roles | role : formik.values.roles & ~role)
                }}
                onBlur={formik.handleBlur}
              />
            }
            label={<FormattedMessage {...systemUserRoleMessages[role]} />}
          />
        ))}
      </FormGroup>

      {isSystemUser && (
        <Typography sx={({ palette }) => ({ mb: 2, color: palette.text.quaternary })}>
          <FormattedMessage {...messages.systemUserWarning} />
        </Typography>
      )}
      <Separator />
      <Button
        color={isSystemUser ? 'error' : 'primary'}
        variant="contained"
        fullWidth
        type="submit"
        disabled={formik.isSubmitting}
      >
        <FormattedMessage {...(variant === 'create' ? messages.create : messages.update)} />
      </Button>
    </form>
  )
}
