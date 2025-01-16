import api from '@/api'
import { useTenantInfo } from './useTenantInfo'

const useTenantSettingsQuery = api.Arteli.TenantSettings.get.asQuery()

const _5_MINUTES = 5 * 60 * 1000

export const useTenantSettings = () => {
  const { tenantUser } = useTenantInfo()
  const tenantId = tenantUser?.tenantId

  return useTenantSettingsQuery({
    params: { id: tenantId },
    enabled: !!tenantId,
    staleTime: _5_MINUTES
  })
}
