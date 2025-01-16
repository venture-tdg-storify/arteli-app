import type { GridBasicGroupNode, GridRenderCellParams } from '@mui/x-data-grid-pro'
import { useCallback } from 'react'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { defineMessages, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { ProductFlags } from '@/api/types.generated'
import FlagIcons from '@/components/FlagIcons'
import ProductFlagsList from '@/components/ProductFlagsList'
import { useExpansionClickHandler } from '@/hooks/useExpansion'
import { useTagList } from '@/hooks/useTagList'
import analytics from '@/utils/analytics'
import { RowType, type Row } from '../../useRows'

const Base = styled('div')(({ level, type }: { level: number; type: Row['type'] }) => ({
  display: 'flex',
  paddingLeft: `${level * 24}px`,
  alignItems: 'center',
  fontWeight: type === 'group' || type === 'subgroup' ? 'bold' : 'normal',
  fontSize: type === 'group' ? 15 : 14
}))

const GroupIcon = styled('div')(({ expanded }: { expanded: boolean }) => ({
  cursor: 'pointer',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  display: 'inline-block'
}))

const messages = defineMessages({
  loading: { defaultMessage: 'loading...', id: 'KiNl6V' },
  kits: { defaultMessage: 'Kits', id: 'zH1ZiW' },
  components: { defaultMessage: 'Components', id: 'AcAA5x' }
})

export function NameColumn({ id, field, rowNode, row }: GridRenderCellParams<Row, string>) {
  const navigate = useNavigate()
  const { formatMessage: t } = useIntl()

  const node: GridBasicGroupNode = rowNode as GridBasicGroupNode
  const expanded = node.childrenExpanded ?? false

  const { type, group, notes, rec, product, subgroup } = row

  const { tagsList } = useTagList({ tags: rec?.productTagsAny ?? 0 })

  const handleClick = useExpansionClickHandler<HTMLDivElement>({ id, field, expanded })

  const handleClickNote = useCallback(() => {
    navigate({ pathname: `${group?.id}/notes`, search: location.search })
  }, [group, navigate])

  const handleClickDetails = useCallback(() => {
    analytics?.track('Recommendation Group Details Clicked', { groupId: group?.id })
    navigate({ pathname: group?.id, search: location.search })
  }, [group, navigate])

  const name = (type === RowType.Group && group?.name) ||
    (type === RowType.Subgroup && subgroup?.name) ||
    (type === RowType.Kit && t(messages.kits)) ||
    (type === RowType.Component && t(messages.components)) ||
    (type === RowType.Product && product?.name) || <i>{t(messages.loading)}</i>

  return (
    <Base level={node.depth} type={type!}>
      {type === RowType.Group && (
        <>
          <Tooltip
            title={tagsList.length > 0 ? <div style={{ whiteSpace: 'pre-line' }}>{tagsList.join('\r\n')}</div> : ''}
          >
            <Icon
              className="fa-circle-info"
              sx={() => ({
                fontSize: 18,
                mr: 1,
                cursor: 'pointer',
                color: tagsList.length > 0 ? '#0468CD' : '#9EA6B0'
              })}
              onClick={handleClickDetails}
            />
          </Tooltip>
          <FlagIcons flags={rec?.productFlagsAny ?? ProductFlags.None} />
          {notes && (
            <IconButton onClick={handleClickNote} sx={{ ml: -1 }}>
              <Icon className="fa-note" />
            </IconButton>
          )}
        </>
      )}
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
      {type === RowType.Product && <ProductFlagsList flags={product?.flags ?? ProductFlags.None} />}
      {type && [RowType.Component, RowType.Kit, RowType.Group, RowType.Subgroup].includes(type) && (
        <GroupIcon expanded={expanded} onClick={handleClick} sx={{ ml: 1 }} data-testid="expand-icon">
          <Icon className="fa-chevron-down" sx={{ fontSize: 14 }} />
        </GroupIcon>
      )}
    </Base>
  )
}
