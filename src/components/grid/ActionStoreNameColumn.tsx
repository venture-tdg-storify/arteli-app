import type { ActionStore, Group, Store } from '@/api/types.generated'
import type { ActionStoreRow } from '@/hooks/useActionStoreRowsQuery'
import type { GridBasicGroupNode, GridRenderCellParams } from '@mui/x-data-grid-pro'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import FlagIcons from '@/components/FlagIcons'
import { LiveViewIcon } from '@/components/LiveView/components/LiveViewIcon'
import PresentationMenu from '@/components/PresentationMenu'
import { usePresentationMenu } from '@/components/PresentationMenu/usePresentationMenu'
import { useExpansionClickHandler } from '@/hooks/useExpansion'
import { actionStoreToProductFlags } from '@/utils/productFlags'

const Base = styled('div')(({ level = 0 }: { level?: number }) => ({
  display: 'flex',
  paddingLeft: `${level * 20}px`,
  alignItems: 'center',
  height: '100%'
}))

type ActionStoreNameColumnProps = Pick<GridRenderCellParams<ActionStoreRow>, 'id' | 'field' | 'rowNode' | 'row'> & {
  storesById: Record<Store['id'], Store>
  addActionsCountByStoreId: Record<Store['id'], number>
  actionStoresById: Record<ActionStore['id'], ActionStore>
  groupsById: Record<Group['id'], Group>
}

export function ActionStoreNameColumn({
  id,
  field,
  rowNode,
  row,
  storesById,
  addActionsCountByStoreId,
  actionStoresById,
  groupsById
}: ActionStoreNameColumnProps) {
  const node: GridBasicGroupNode = rowNode as GridBasicGroupNode
  const expanded = node.childrenExpanded ?? false

  const { handleMouseEnter, handleMouseLeave, setShowMenu, showMenu } = usePresentationMenu()

  const handleClick = useExpansionClickHandler({ id, field, expanded })

  if (node.type === 'group') {
    if (node.depth === 0) {
      const storeId = node.groupingKey as Store['id']
      const store = storesById[storeId]

      if (!store) return

      return (
        <Base level={node.depth}>
          {store.externalId} {store.name} ({addActionsCountByStoreId[storeId]})
          <LiveViewIcon storeId={storeId} />
          <IconButton
            sx={({ transitions }) => ({
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: transitions.create(['transform'], {
                duration: transitions.duration.standard
              })
            })}
            onClick={handleClick}
          >
            <Icon className="fa-chevron-down" sx={{ fontSize: 14 }} />
          </IconButton>
        </Base>
      )
    } else {
      const actionStore = actionStoresById[node.groupingKey as ActionStore['id']]
      if (!actionStore) return
      const group = groupsById[actionStore.groupId]
      if (!group) return

      return (
        <Base level={node.depth} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Icon
            className="fa-circle-plus"
            sx={(theme) => ({ fontSize: 18, mr: 1, color: theme.palette.text.tertiary })}
          />
          <FlagIcons flags={actionStoreToProductFlags(row.actionStore)} />
          {group.name}
          <IconButton
            sx={({ transitions }) => ({
              ml: 0.5,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: transitions.create(['transform'], {
                duration: transitions.duration.standard
              })
            })}
            onClick={handleClick}
          >
            <Icon className="fa-chevron-down" sx={{ fontSize: 14 }} />
          </IconButton>
          {showMenu && <PresentationMenu row={row} onClose={() => setShowMenu(false)} />}
        </Base>
      )
    }
  }

  return (
    <Base level={node.depth} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {!row.product && (
        <Icon
          className={row.actionStore.actionType === 'Add' ? 'fa-circle-plus' : 'fa-circle-minus'}
          sx={(theme) => ({ fontSize: 18, mr: 1, color: theme.palette.text.tertiary })}
        />
      )}
      {!row?.product && <FlagIcons flags={actionStoreToProductFlags(row.actionStore)} />}

      <Typography
        variant="body2"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        noWrap
        textOverflow="ellipsis"
      >
        {row?.product?.name || row.group.name}
      </Typography>
      {showMenu && !row.product && <PresentationMenu row={row} onClose={() => setShowMenu(false)} />}
    </Base>
  )
}
