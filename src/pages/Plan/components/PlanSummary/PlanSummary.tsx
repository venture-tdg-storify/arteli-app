import type { ActionSet } from '@/api/types.generated'
import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import type { Dayjs } from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { NavLink, useNavigate } from 'react-router-dom'
import { TenantUserRoles } from '$/api/system'
import api from '@/api'
import Summary from '@/components/Summary'
import { useActionSetCsvDownload } from '@/hooks/useActionSetCsvDownload'
import { useTenantInfo } from '@/hooks/useTenantInfo'
import { PATH_BUSINESS_MONITOR } from '@/routes'
import { toast } from '@/store/notifications'
import analytics from '@/utils/analytics'
import { usePresentationRows } from '../../usePresentationRows'
import { FinalizeModal } from './FinalizeModal'
import { useStats } from './useStats'

const messages = defineMessages({
  planSummary: { defaultMessage: 'Plan Summary', id: 'cxo8kC' },
  pendingSwaps: { defaultMessage: 'Pending Swaps', id: 'ZTuX5P' },
  noItemsAdded: { defaultMessage: 'No items have been added to the Plan', id: '7l9ef4' },
  addRecommendations: {
    defaultMessage: 'Add recommendations to your plan, to see a summary and associated alerts here',
    id: '7RxvPM'
  },
  finalize: { defaultMessage: 'Finalize', id: 'J9w6+G' },
  success: { defaultMessage: 'Plan successfully finalized', id: 'JZ5QRA' },
  downloadPlan: { defaultMessage: 'Download Plan', id: '01uDLF' }
})

const useFinalizeActionSetMutation = api.Arteli.ActionSets.finalize.asMutation()
const useTenantSettingsQuery = api.Arteli.TenantSettings.get.asQuery()

export const PlanSummary = ({
  actionSet,
  rows: rows_,
  isFetching
}: {
  actionSet?: ActionSet
  rows: readonly ActionStoreRow[]
  isFetching: boolean
}) => {
  const { formatMessage: t } = useIntl()
  const [overdueDate, setOverdueDate] = useState<Dayjs | null>(null)
  const [planName, setPlanName] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { tenantUser } = useTenantInfo()
  const { rows } = usePresentationRows(rows_)

  const { data: tenantSettings } = useTenantSettingsQuery({ params: { id: tenantUser?.id }, enabled: !!tenantUser?.id })
  const isFinalized = actionSet?.status === 'Finalized'
  const canFinalize = Boolean(tenantUser && tenantUser.roles & TenantUserRoles.FinalizeActionSet)
  const { predictedImpact } = useStats(rows)
  const addCount = useMemo(() => rows?.filter((a) => a.actionStore.actionType === 'Add').length, [rows])
  const showStatus = useMemo(() => rows?.some((row) => row.status), [rows])

  const { download } = useActionSetCsvDownload()

  const { mutate: finalize, isPending: isFinalizePending } = useFinalizeActionSetMutation({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['action-sets'] })
    },
    onSuccess: () => {
      setOpen(false)
      navigate('../')
      toast.Success(t(messages.success))
    }
  })

  const handleOnFinalize = useCallback(() => {
    if (overdueDate) {
      analytics?.track('Finalize action set button clicked')
      const overdueDays = overdueDate.endOf('day').diff(dayjs(), 'days')
      const name = planName || 'Arteli_' + dayjs().format('YYYY-MM-DD')
      finalize({ body: { overdueDays, name } })
    }
  }, [finalize, overdueDate, planName])

  const handleDownload = useCallback(async () => {
    if (actionSet && rows?.length && !isFetching) {
      const sortedRows = [...rows]
        .sort((a, b) => Date.parse(b.actionStore.createdAt) - Date.parse(a.actionStore.createdAt))
        .sort((a, b) => (a.actionStore.dependentId === b.actionStore.id ? 0 : 1))
        .sort((a, b) => a.store.externalId?.localeCompare(b.store.externalId || '') || 0)
      download(sortedRows, actionSet)
    }
  }, [actionSet, download, isFetching, rows])

  const handleOnClose = useCallback(() => {
    if (tenantSettings?.actionOverdueDays) {
      setOverdueDate(dayjs().startOf('day').add(tenantSettings.actionOverdueDays, 'days'))
    }
    setOpen(false)
  }, [tenantSettings])

  const handleSetOverdue = useCallback(
    (date: Dayjs | null) => {
      if (date) {
        setOverdueDate(date.endOf('day'))
      }
    },
    [setOverdueDate]
  )

  useEffect(() => {
    if (tenantSettings?.actionOverdueDays) {
      setOverdueDate(dayjs().startOf('day').add(tenantSettings.actionOverdueDays, 'days'))
    }
  }, [tenantSettings])

  return (
    <Summary
      total={rows?.length || 0}
      count={addCount || 0}
      isFetching={isFetching}
      predictedImpact={predictedImpact || 0}
      title={<FormattedMessage {...messages.planSummary} />}
      label={<FormattedMessage {...messages.pendingSwaps} />}
      emptyTitle={<FormattedMessage {...messages.noItemsAdded} />}
      emptyDescription={<FormattedMessage {...messages.addRecommendations} />}
      countIcon="fa-pencil-alt"
      updatedAt={actionSet?.updatedAt}
      additionAction={
        <IconButton component={NavLink} to={PATH_BUSINESS_MONITOR}>
          <Icon className="fa-ellipsis-vertical" />
        </IconButton>
      }
    >
      {!isFinalized && canFinalize && overdueDate && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', ml: 1 }}>
          <Button color="secondary" variant="outlined" onClick={() => handleDownload()} disabled={isFetching}>
            <FormattedMessage {...messages.downloadPlan} />
            <Icon className="fa-solid fa-cloud-arrow-down" sx={{ ml: 1 }} />
          </Button>
          <Button color="primary" variant="contained" onClick={() => setOpen(true)}>
            <FormattedMessage {...messages.finalize} />
          </Button>
        </Stack>
      )}
      <FinalizeModal
        open={open}
        name={planName}
        overdueDate={overdueDate}
        showStatus={showStatus}
        pending={isFinalizePending}
        onClose={handleOnClose}
        onFinalize={handleOnFinalize}
        onSetName={setPlanName}
        onSetDate={handleSetOverdue}
      />
    </Summary>
  )
}
