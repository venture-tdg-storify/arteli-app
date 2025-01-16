import type { Row } from '../useRows'
import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useCallback, useState } from 'react'
import Icon from '@mui/material/Icon'
import Stack from '@mui/material/Stack'
import { useQueryClient } from '@tanstack/react-query'
import { TenantUserRoles } from '$/api/types.generated'
import api from '@/api'
import { useTenantInfo } from '@/hooks/useTenantInfo'
import { RenamePlanModal } from './RenamePlanModal'

const useActionSetUpdate = api.Arteli.ActionSets.update.asMutation()

export const NameColumn = ({ row: { actionSet } }: GridRenderCellParams<Row>) => {
  const [open, setOpen] = useState(false)
  const [display, setDisplay] = useState<'none' | 'flex'>('none')
  const { tenantUser } = useTenantInfo()
  const queryClient = useQueryClient()

  const canFinalize = Boolean(tenantUser && tenantUser.roles & TenantUserRoles.FinalizeActionSet)

  const { mutate: updateActionSet, isPending } = useActionSetUpdate({
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['action-sets', 'statuses=Finalized', 'all'] })
    },
    onSuccess: () => {
      setOpen(false)
    }
  })

  const handleIconClick = useCallback(() => {
    setOpen(true)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (canFinalize) setDisplay('flex')
  }, [canFinalize])

  const handleMouseLeave = useCallback(() => {
    if (canFinalize) setDisplay('none')
  }, [canFinalize])

  const handleConfirm = useCallback(
    (name: string) => {
      updateActionSet({ params: { id: actionSet.id }, body: { name } })
    },
    [actionSet.id, updateActionSet]
  )

  if (!actionSet) return null

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="start"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{actionSet.name}</div>
        {canFinalize && (
          <Icon
            data-testid="edit-icon"
            className="fa-pencil-alt"
            sx={{ cursor: 'pointer', fontSize: 14, display }}
            onClick={handleIconClick}
          />
        )}
      </Stack>
      {open && (
        <RenamePlanModal
          open={true}
          value={actionSet.name}
          onClose={() => setOpen(false)}
          onConfirm={handleConfirm}
          isPending={isPending}
        />
      )}
    </>
  )
}
