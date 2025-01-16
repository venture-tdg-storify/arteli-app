import type { ProductTagWithUIConfig } from './useTags'
import type { ActionType, Category } from '@/api/types.generated'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import api from '@/api'
import { toast } from '@/store/notifications'
import { allItemsQuery } from '@/utils/allItemsQuery'
import { commonMessages } from '@/utils/messages'
import { FloorDate } from './FloorDate'
import { Recommendations } from './Recommendations'
import { ROICalculation } from './ROICalculation'
import { useTags } from './useTags'

const messages = defineMessages({
  recommendations: { defaultMessage: 'Recommendations', id: 'EnTkxu' },
  businessRulesHint: {
    defaultMessage: 'Customize your Add + Remove recommendations by establishing your business rules here.',
    id: 'nECf+l'
  },
  save: { defaultMessage: 'Save Changes', id: '3VI9mt' },
  success: { defaultMessage: 'Settings saved successfully', id: '1mwTYW' },
  roiSuccess: { defaultMessage: 'Operating Cost saved successfully', id: '7mQR99' },
  added: { defaultMessage: 'Recently Added to Floor Date', id: '6NS72p' },
  addedHint: {
    defaultMessage: 'Specify how many days is considered recent in terms of adding a series to the floor.',
    id: 'eIVbLC'
  },
  removed: { defaultMessage: 'Recently Removed from Floor Date', id: 'UukxFB' },
  removedHint: {
    defaultMessage: 'Specify how many days is considered recent in terms of removing a series to the floor.',
    id: 'AHUHlb'
  },
  days: { defaultMessage: 'Days', id: 'd8EqQY' }
})

const Container = styled('div')(({ theme: { spacing } }) => ({
  marginRight: spacing(30),
  overflow: 'auto'
}))

const THRESHOLD_DAYS = 30

const useTenantUpdate = api.Arteli.TenantSettings.update.asMutation()
const useAllCategories = allItemsQuery(api.Arteli.Categories.findAll)
const useCategoriesUpdate = api.Arteli.Categories.update.asMutation()

export const BusinessRules = () => {
  const queryClient = useQueryClient()
  const [tenantDirty, setTenantDirty] = useState(false)
  const [roiDirty, setRoiDirty] = useState(0)
  const [tags, setTags] = useState<ProductTagWithUIConfig[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recentlyAddedThresholdDays, setRecentlyAddedThresholdDays] = useState(THRESHOLD_DAYS)
  const [recentlyRemovedThresholdDays, setRecentlyRemovedThresholdDays] = useState(THRESHOLD_DAYS)
  const { formatMessage: t } = useIntl()
  const { rows, tenantId, tenantSettings, canFinalize, isFetching } = useTags()

  const { data: allCategories } = useAllCategories({
    params: { limit: 1000, includeInactive: false },
    enabled: canFinalize
  })

  const { mutate: updateCategory } = useCategoriesUpdate({
    onSettled: async () => {
      if (roiDirty === 1) {
        await queryClient.invalidateQueries({ queryKey: ['categories'] })
      }
    },
    onSuccess: () => {
      if (roiDirty === 1) {
        toast.Success(t(messages.roiSuccess))
      }
      setRoiDirty(roiDirty - 1)
    },
    onError: (error) => {
      setRoiDirty(roiDirty - 1)
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  const { mutate: updateTenant } = useTenantUpdate({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tenant-settings', { id: tenantId }] })
      await queryClient.invalidateQueries({ queryKey: ['products', 'tags'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
      setTenantDirty(false)
    },
    onError: (error) => {
      setTenantDirty(false)
      toast.Error(t(commonMessages.somethingWentWrong, { status: error.response?.status ?? -1 }))
    }
  })

  useEffect(() => {
    setTags(rows)
  }, [rows])

  useEffect(() => {
    if (allCategories?.length) {
      setCategories(allCategories)
    }
  }, [allCategories])

  useEffect(() => {
    setRecentlyAddedThresholdDays(tenantSettings?.recentlyAddedThresholdDays ?? THRESHOLD_DAYS)
    setRecentlyRemovedThresholdDays(tenantSettings?.recentlyRemovedThresholdDays ?? THRESHOLD_DAYS)
  }, [tenantSettings])

  useEffect(() => {
    const roiCount = categories.filter(
      (category) => category.operatingCost !== allCategories?.find((c) => c.id === category.id)?.operatingCost
    ).length
    setRoiDirty(roiCount)
  }, [allCategories, categories])

  const handleTagChange = (id: string, type: ActionType, value: boolean) => {
    setTenantDirty(true)
    setTags((prev) =>
      prev.map((tag) => {
        if (tag.id === id) {
          return {
            ...tag,
            filters: value ? [...tag.filters, type] : tag.filters.filter((_) => _ !== type)
          }
        }
        return tag
      })
    )
  }

  const handleShowChange = (id: string, value: boolean) => {
    setTenantDirty(true)
    setTags((prev) =>
      prev.map((tag) => {
        if (tag.id === id) {
          return {
            ...tag,
            show: value
          }
        }
        return tag
      })
    )
  }

  const handleROIChange = (id: string, value: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === id) {
          return { ...category, operatingCost: value ? Number(value) : 0 }
        }
        return category
      })
    )
  }

  const handleRecentAddedChange = (value: number) => {
    setRecentlyAddedThresholdDays(value)
    setTenantDirty(true)
  }

  const handleRecentRemovedChange = (value: number) => {
    setRecentlyRemovedThresholdDays(value)
    setTenantDirty(true)
  }

  const handleSubmit = useCallback(() => {
    if (tenantDirty) {
      updateTenant({
        params: { id: tenantId! },
        body: {
          ...tenantSettings!,
          recentlyAddedThresholdDays,
          recentlyRemovedThresholdDays,
          uiConfig: {
            ...tenantSettings?.uiConfig,
            selectWebApp: {
              ...tenantSettings?.uiConfig?.selectWebApp,
              recommendationUiFilters: tags.reduce(
                (acc, tag) => {
                  acc[tag.id] = tag.filters
                  return acc
                },
                {} as Record<string, ActionType[]>
              ),
              recommendationUiDisplay: tags.reduce(
                (acc, tag) => {
                  acc[tag.id] = tag.show
                  return acc
                },
                {} as Record<string, boolean>
              ),
              seriesPerformanceReportUI: {
                showRemoved: tenantSettings?.uiConfig?.selectWebApp?.seriesPerformanceReportUI.showRemoved ?? false
              }
            }
          }
        }
      })
    }

    if (canFinalize) {
      categories.forEach((category) => {
        if (category.operatingCost !== allCategories?.find((c) => c.id === category.id)?.operatingCost) {
          updateCategory({
            params: { id: category.id },
            body: { operatingCost: category.operatingCost }
          })
        }
      })
    }
  }, [
    allCategories,
    canFinalize,
    categories,
    recentlyAddedThresholdDays,
    recentlyRemovedThresholdDays,
    tags,
    tenantDirty,
    tenantId,
    tenantSettings,
    updateCategory,
    updateTenant
  ])

  const dirty = useMemo(() => roiDirty > 0 || tenantDirty, [roiDirty, tenantDirty])

  return (
    <Container>
      <Typography
        component="h1"
        variant="h4"
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 30, mb: 1 })}
      >
        <FormattedMessage {...messages.recommendations} />
      </Typography>
      <Typography>
        <FormattedMessage {...messages.businessRulesHint} />
      </Typography>
      <Recommendations
        tags={tags}
        onTagChange={handleTagChange}
        onShowChange={handleShowChange}
        isFetching={isFetching}
      />
      {canFinalize && <ROICalculation categories={categories} onChange={handleROIChange} />}
      <FloorDate
        title={messages.added}
        subtitle={messages.addedHint}
        value={recentlyAddedThresholdDays}
        valueDescription={messages.days}
        onChange={handleRecentAddedChange}
      />
      <FloorDate
        title={messages.removed}
        subtitle={messages.removedHint}
        value={recentlyRemovedThresholdDays}
        valueDescription={messages.days}
        onChange={handleRecentRemovedChange}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 8 }} disabled={!dirty} onClick={handleSubmit}>
        <FormattedMessage {...messages.save} />
      </Button>
    </Container>
  )
}
