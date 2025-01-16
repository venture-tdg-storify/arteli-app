import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useCallback } from 'react'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useQueryClient } from '@tanstack/react-query'
import { defineMessages, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import api from '@/api'
import { useFilterFlags } from '@/hooks/useFilters'
import { toast } from '@/store/notifications'
import analytics from '@/utils/analytics'
import { RowType, type Row } from '../../useRows'

const useReinstateMutation = api.Arteli.Rejections.destroy.asMutation()

const messages = defineMessages({
  approve: { defaultMessage: 'Approve', id: 'WCaf5C' },
  addItem: { defaultMessage: 'Create an action to add this item to the floor', id: 'zY8iPs' },
  removeItem: { defaultMessage: 'Create an action to remove this item from the floor', id: 'Gc1S/o' },
  reject: { defaultMessage: 'Reject', id: 'VzIOKf' },
  reinstate: { defaultMessage: 'Reinstate', id: 'i/T8eH' },
  success: { defaultMessage: 'Reinstated successfully', id: 'TgjURs' }
})

const Base = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  textDecoration: 'none'
}))

export const ActionsColumn = ({ row }: GridRenderCellParams<Row>) => {
  const navigate = useNavigate()
  const { formatMessage: t } = useIntl()
  const queryClient = useQueryClient()
  const { allowActions } = useFilterFlags()

  const { mutate: reinstate, isPending } = useReinstateMutation({
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rejections'] })
    },
    onSuccess: () => {
      toast.Success(t(messages.success))
    }
  })

  const { type, rejections, group, rec } = row

  const handleApprove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      navigate(`./${group?.id}/swap`, {
        state: { storeIds: rec?.storeIdsOverFilteredAddableStores }
      })

      analytics?.track('Approve button clicked', { group: group?.id })
    },
    [rec?.storeIdsOverFilteredAddableStores, group?.id, navigate]
  )

  const handleReinstate = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      analytics?.track('Reinstate button clicked', { group: group?.id })
      if (rejections?.length) {
        reinstate({ params: { ids: rejections.map(({ id }) => id) } })
      }
    },
    [group?.id, reinstate, rejections]
  )

  const handleReject = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      analytics?.track('Reject button clicked', { group: group?.id })
      navigate({ pathname: `./${group?.id}/reject`, search: location.search })
    },
    [group?.id, navigate]
  )

  if (type !== RowType.Group || !allowActions) {
    return null
  }
  return (
    <Base>
      <Stack justifyContent="center" alignContent="space-between" sx={{ height: '100%' }} spacing={1}>
        {Boolean(rejections?.length) && (
          <Tooltip title={t(messages.reinstate)}>
            <Button
              size="small"
              sx={{ borderRadius: 48, minWidth: 40, padding: 1 }}
              variant="outlined"
              color="primary"
              onClickCapture={handleReinstate}
              disabled={isPending}
            >
              <Icon className="fa-solid fa-plus" sx={(theme) => ({ color: theme.palette.primary.main })} />
            </Button>
          </Tooltip>
        )}
        {!rejections?.length && (
          <>
            <Tooltip title={t(messages.approve)}>
              <Button
                size="small"
                variant="contained"
                sx={{ borderRadius: 48, minWidth: 40, padding: 1 }}
                color="primary"
                onClickCapture={handleApprove}
              >
                <Icon className="fa-solid fa-circle-check" sx={{ color: 'background.default' }} />
              </Button>
            </Tooltip>
            <Tooltip title={t(messages.reject)}>
              <Button
                size="small"
                variant="contained"
                sx={(theme) => ({
                  borderRadius: 48,
                  minWidth: 40,
                  padding: 1,
                  backgroundColor: theme.palette.grey[600]
                })}
                onClickCapture={handleReject}
              >
                <Icon className="fa-solid fa-ban" sx={(theme) => ({ color: theme.palette.background.default })} />
              </Button>
            </Tooltip>
          </>
        )}
      </Stack>
    </Base>
  )
}
