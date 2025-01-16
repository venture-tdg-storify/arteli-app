import type { TenantUserCreate } from '$/api/system'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { useFormik } from 'formik'
import { FormattedMessage, defineMessages } from 'react-intl'
import { TenantUserRoles } from '$/api/system'
import { tenantUserRoleMessages } from '$/utils/userRoleMessages'
import { useTenantUserValidationSchema } from './hooks'

const Separator = styled('div')(({ theme: { spacing } }) => ({
  height: spacing(3)
}))

const messages = defineMessages({
  add: { defaultMessage: 'Add', id: '2/2yg+' },
  update: { defaultMessage: 'Update', id: 'BWpuKl' },
  active: { defaultMessage: 'Active', id: '3a5wL8' },
  roles: { defaultMessage: 'Roles', id: 'c35gM5' }
})

export type TenantUserFormFields = Omit<TenantUserCreate, 'tenantId' | 'userId'>

const tenantUserRoles: TenantUserRoles[] = [
  TenantUserRoles.UserManagement,
  TenantUserRoles.Writer,
  TenantUserRoles.FinalizeActionSet,
  TenantUserRoles.DeleteActionSet,
  TenantUserRoles.EmailNotifications,
  TenantUserRoles.TenantSettingsManagement,
  TenantUserRoles.UserJobManagement
]

export function TenantUserForm({
  onSubmit,
  initialValues,
  variant = 'create'
}: {
  onSubmit: (values: TenantUserFormFields) => void
  initialValues?: Partial<TenantUserFormFields>
  variant?: 'create' | 'update'
}) {
  const validationSchema = useTenantUserValidationSchema()

  const formik = useFormik<TenantUserFormFields>({
    enableReinitialize: true,
    initialValues: {
      isActive: true,
      roles: TenantUserRoles.None,
      categoryExternalIds: ['*'],
      storeExternalIds: ['*'],
      ...initialValues
    },
    validationSchema,
    onSubmit
  })

  return (
    <form onSubmit={formik.handleSubmit}>
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
          />
        }
        label={<FormattedMessage {...messages.active} />}
        labelPlacement="end"
      />
      <Separator />
      <FormLabel component="legend" sx={{ mb: 1 }}>
        <FormattedMessage {...messages.roles} />
      </FormLabel>
      <FormGroup>
        {tenantUserRoles.map((role) => (
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
            label={<FormattedMessage {...tenantUserRoleMessages[role]} />}
          />
        ))}
      </FormGroup>

      <Separator />
      <Button color="primary" variant="contained" fullWidth type="submit" disabled={formik.isSubmitting}>
        <FormattedMessage {...(variant === 'create' ? messages.add : messages.update)} />
      </Button>
    </form>
  )
}
