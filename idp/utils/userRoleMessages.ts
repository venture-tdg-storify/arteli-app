import { defineMessages } from 'react-intl'
import { TenantUserRoles } from '$/api/system'

export const tenantUserRoleMessages = defineMessages({
  [TenantUserRoles.None]: { defaultMessage: 'None', id: '450Fty' },
  [TenantUserRoles.UserManagement]: { defaultMessage: 'Customer Management', id: 'wBkN83' },
  [TenantUserRoles.Writer]: { defaultMessage: 'Writer', id: '6uEiaw' },
  [TenantUserRoles.FinalizeActionSet]: { defaultMessage: 'Finalize Plan', id: 'T2J+2x' },
  [TenantUserRoles.DeleteActionSet]: { defaultMessage: 'Delete Plan', id: 'anjVkZ' },
  [TenantUserRoles.EmailNotifications]: { defaultMessage: 'Email Notifications', id: '1V1nJ/' },
  [TenantUserRoles.TenantSettingsManagement]: { defaultMessage: 'Company Settings Management', id: 'Nm6VXP' },
  [TenantUserRoles.UserJobManagement]: { defaultMessage: 'File Management', id: 'cbDX6a' }
})
