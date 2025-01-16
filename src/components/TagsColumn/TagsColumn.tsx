import Tooltip from '@mui/material/Tooltip'
import { useTagList } from '@/hooks/useTagList'

export const TagsColumn = ({ value: tags }: { value?: number }) => {
  const { tagsList } = useTagList({ tags })

  if (!tags) {
    return null
  }

  const tooltipTitle = tagsList.length > 2 ? <div style={{ whiteSpace: 'pre-line' }}>{tagsList.join('\r\n')}</div> : ''

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        {tagsList.slice(0, 2).join(',\r\n')}
        {tagsList.length > 2 && '...'}
      </span>
    </Tooltip>
  )
}
