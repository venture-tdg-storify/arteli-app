import type { TenantUser } from '$/api/system'
import { useMemo } from 'react'
// import { TenantFlags } from '$/api/system'
import { useSession } from './useSession'
import { useSettings } from './useSettings'

export const useTenantInfo = () => {
  const { me } = useSession()
  const { tenantUserId } = useSettings()

  return useMemo<{ tenantUser?: TenantUser }>(() => {
    const tenantUser = me.tenantUsers.find((tu) => tu.id === tenantUserId)
    // const tenant = me.tenants.find((t) => t.id === tenantUser?.tenantId)

    return { tenantUser }
  }, [me, tenantUserId])
}
