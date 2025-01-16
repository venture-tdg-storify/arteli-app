import { useMemo } from 'react'
import api from '@/api'
import { useTenantSettings } from './useTenantSettings'

const useTagsQuery = api.Arteli.Tags.getAll.asQuery()

const _5_MINUTES = 5 * 60 * 1000

export const useVisibleTags = () => {
  const { data: tenantSettings } = useTenantSettings()

  const { data: tags } = useTagsQuery({ staleTime: _5_MINUTES })

  return useMemo(() => {
    const t = [...(tags ?? [])].sort((a, b) => a.name.localeCompare(b.name))

    const tagSettings = tenantSettings?.uiConfig?.selectWebApp

    if (!tagSettings) {
      return { visibleTags: [], addFlags: [], removeFlags: [] }
    }

    const visibleTags = t.filter(({ id }) => tagSettings.recommendationUiDisplay?.[id])

    const tagFilterSettings = Object.entries(tagSettings.recommendationUiFilters ?? {})

    const addFlags = t.filter((tag) =>
      tagFilterSettings.some(([id, actionTypes]) => id === tag.id && actionTypes.includes('Add'))
    )

    const removeFlags = t.filter((tag) =>
      tagFilterSettings.some(([id, actionTypes]) => id === tag.id && actionTypes.includes('Remove'))
    )

    return { visibleTags, addFlags, removeFlags }
  }, [tags, tenantSettings])
}
