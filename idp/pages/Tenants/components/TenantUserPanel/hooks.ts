import type { TenantUserFormFields } from './TenantUserForm'
import { useMemo } from 'react'
import * as yup from 'yup'

export const useTenantUserValidationSchema = () => {
  return useMemo(() => yup.object<TenantUserFormFields>({}), [])
}
