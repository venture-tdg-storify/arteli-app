import type { Row } from '../useRows'
import type { GridBasicGroupNode, GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useContext } from 'react'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { defineMessages, useIntl } from 'react-intl'
import { ProductFlags, type Store, RecGroupRecStoreFlags } from '@/api/arteli'
import ClearanceIcon from '@/components/ClearanceIcon'
import ProductFlagsList from '@/components/ProductFlagsList'
import { useExpansionClickHandler } from '@/hooks/useExpansion'
import { GridContext } from '../GridContext'
import { LiveViewIcon } from './LiveViewIcon'

const messages = defineMessages({
  noSeries: { defaultMessage: 'No series being removed', id: 'SueUbM' }
})

const Base = styled('div')(({ level = 0 }: { level?: number }) => ({
  display: 'flex',
  paddingLeft: `${level * 20}px`,
  alignItems: 'center',
  height: '100%'
}))

export function NameColumn({ id, field, rowNode, row }: GridRenderCellParams<Row>) {
  const { storesById, clearanceStatus } = useContext(GridContext)
  const node: GridBasicGroupNode = rowNode as GridBasicGroupNode
  const { formatMessage: t } = useIntl()
  const expanded = node.childrenExpanded ?? false

  const handleClick = useExpansionClickHandler({ id, field, expanded })

  if (node.type === 'group') {
    const storeId = node.groupingKey as Store['id']
    const store = storesById[storeId]
    const clearance = clearanceStatus[storeId]

    if (!store) return null

    return (
      <Base level={node.depth}>
        {store.externalId} {store.name}
        <LiveViewIcon storeId={store.id} />
        {clearance && (
          <Box pr={1.5}>
            <ClearanceIcon clearanceAndSale={false} isSwap={true} />
          </Box>
        )}
        &nbsp;
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
  }

  const clearance =
    row.recGroup?.actionType === 'Remove' &&
    Boolean((row.recGroup?.recStoreFlagsAny ?? 0) & RecGroupRecStoreFlags.Clearance)

  return (
    <Base level={node.depth}>
      <Tooltip title={row.group ? '' : t(messages.noSeries)}>
        <Icon
          className="fa-circle-minus"
          sx={(theme) => ({
            fontSize: 18,
            mr: 1,
            color: row.group ? theme.palette.text.tertiary : theme.palette.error.main
          })}
        />
      </Tooltip>
      <Typography
        variant="body2"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        noWrap
        textOverflow="ellipsis"
      >
        {row.group?.name ?? 'N/A'}
      </Typography>
      <ProductFlagsList flags={row.recGroup?.productFlagsAny ?? ProductFlags.None} />
      {Boolean(clearance) && (
        <Box pl={0.5}>
          <ClearanceIcon clearanceAndSale={true} isSwap={true} />
        </Box>
      )}
      {row.note.trim() && <Icon className="fa-note" sx={{ ml: 1 }} />}
    </Base>
  )
}
