import type { Row, RowType } from '../useRows'
import { useCallback, useContext, useState } from 'react'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { type GridBasicGroupNode, type GridRenderCellParams } from '@mui/x-data-grid-pro'
import { defineMessages, useIntl } from 'react-intl'
import { type ProductType, RecStoreFlags } from '@/api/types.generated'
import ClearanceIcon from '@/components/ClearanceIcon'
import ProductImage from '@/components/ProductImage'
import { useExpansionClickHandler } from '@/hooks/useExpansion'
import { GridContext } from '../GridContext'

const productTypeMessages = defineMessages({
  ['Kit' as ProductType]: { defaultMessage: 'Kits', id: 'zH1ZiW' },
  ['Component' as ProductType]: { defaultMessage: 'Component', id: 'S6QlZn' },
  ['Item' as ProductType]: { defaultMessage: 'Item', id: '5ujeDa' }
})

const Base = styled('div')(({ level = 0 }: { level?: number }) => ({
  display: 'flex',
  paddingLeft: `${level * 20}px`,
  alignItems: 'center',
  height: '100%'
}))

export function NameColumn({ id, field, rowNode, row }: GridRenderCellParams<Row>) {
  const { groupsById, subgroupsById, stats, sub, comp, kit } = useContext(GridContext)
  const { formatMessage: t } = useIntl()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const node: GridBasicGroupNode = rowNode as GridBasicGroupNode
  const expanded = node.childrenExpanded ?? false

  const handleClick = useExpansionClickHandler({ id, field, expanded })

  const handleIconClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    },
    [anchorEl]
  )

  const handleClose = useCallback(() => {
    if (anchorEl) {
      setAnchorEl(null)
    }
  }, [anchorEl])

  if (node.type === 'group') {
    let groupId = node.groupingKey as string
    let operator = stats
    let name = ''

    if (node.depth === 0) {
      name = groupsById[groupId].name
    }

    if (node.depth === 1) {
      name = subgroupsById[groupId].name
      operator = sub
    }

    if (node.depth === 2 && ['Kit', 'Component', 'Item'].includes(node.groupingKey as RowType)) {
      groupId = id.toString().split('/')[2].split('-')[0]
      name = t(productTypeMessages[node.groupingKey as ProductType])
      if (node.groupingKey === 'Component') {
        operator = comp
      }
      if (node.groupingKey === 'Kit') {
        operator = kit
      }
    }

    const clearanceOnly = operator[groupId].clearance.filter(({ actionType }) => actionType === 'Add').length > 0
    const clearanceAndSale = operator[groupId].clearance.filter(({ actionType }) => actionType === 'Remove').length > 0

    return (
      <Base level={node.depth}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        &nbsp;
        {Boolean(clearanceOnly) && (
          <Box pr={2}>
            <ClearanceIcon clearanceAndSale={false} />
          </Box>
        )}
        {Boolean(clearanceAndSale) && (
          <Box pr={1}>
            <ClearanceIcon />
          </Box>
        )}
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

  const open = Boolean(anchorEl)
  const anchorId = open ? 'simple-popper' : undefined
  const imageUrls = row.product.imageUrls
  const recStore = row.recStore
  const clearance = (recStore?.flags ?? 0) & RecStoreFlags.Clearance

  return (
    <Base level={node.depth}>
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.product.name}</div>
      {Boolean(clearance) && (
        <Box pl={0.5} pr={1}>
          <ClearanceIcon clearanceAndSale={recStore?.actionType === 'Remove'} isProduct={true} />
        </Box>
      )}
      {imageUrls?.length && (
        <>
          <IconButton
            aria-describedby={anchorId}
            color="primary"
            aria-label="image"
            onClick={handleIconClick}
            key={row.product.name}
          >
            <Icon className="fa-image" sx={{ fontSize: 18 }} />
          </IconButton>
          <Popover
            id={anchorId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight="bold" gutterBottom>
                {row.product.name}
              </Typography>
              <ProductImage img={imageUrls[0]} height={120} />
            </Paper>
          </Popover>
        </>
      )}
    </Base>
  )
}
