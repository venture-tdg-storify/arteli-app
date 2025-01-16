import type { ActionType, ProductTag } from '@/api/types.generated'
import { useEffect, useState } from 'react'
import { TenantUserRoles } from '$/api/types.generated'
import api from '@/api'
import { useTenantInfo } from '@/hooks/useTenantInfo'

export type ProductTagWithUIConfig = ProductTag & { filters: ActionType[]; show: boolean }

const initialData: ProductTagWithUIConfig[] = [] as ProductTagWithUIConfig[]

const useTenantSettingsQuery = api.Arteli.TenantSettings.get.asQuery()
const useTagsQuery = api.Arteli.Tags.getAll.asQuery()

export const useTags = () => {
  const { tenantUser } = useTenantInfo()
  const tenantId = tenantUser?.tenantId

  const canFinalize = Boolean(tenantUser && tenantUser.roles & TenantUserRoles.FinalizeActionSet)

  const { data: tenantSettings, isFetching: isFetchingTenantSettings } = useTenantSettingsQuery({
    params: { id: tenantId },
    enabled: !!tenantId
  })

  const { data: tags, isFetching: isFetchingTags } = useTagsQuery()

  const [rows, setRows] = useState<ProductTagWithUIConfig[]>(initialData)
  const isFetching = isFetchingTenantSettings || isFetchingTags

  useEffect(() => {
    setRows((prevRows) => {
      if (isFetching) {
        return prevRows
      }

      const partialRows = tags

      if (!partialRows?.length) {
        return initialData
      }

      return partialRows.map((tag) => ({
        ...tag,
        show: tenantSettings?.uiConfig?.selectWebApp?.recommendationUiDisplay?.[tag.id] ?? false,
        filters: tenantSettings?.uiConfig?.selectWebApp?.recommendationUiFilters?.[tag.id] ?? []
      }))
    })
  }, [isFetching, tags, tenantSettings])

  return { rows, isFetching, tenantId, tenantSettings, canFinalize }
}
