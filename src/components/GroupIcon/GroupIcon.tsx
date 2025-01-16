import type { Group } from '@/api/types.generated'
import { useCallback, useMemo, useState } from 'react'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'
import { ProductImage } from '../ProductImage/ProductImage'
import { useRecommendationDetails } from './useRecommendationDetails'

export const GroupIcon = ({ groupId }: { groupId: Group['id'] }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined

  const { imageUrls, isFetching } = useRecommendationDetails({ groupId, open })

  const image = useMemo(() => imageUrls.find((i) => i !== null), [imageUrls])

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    },
    [anchorEl]
  )

  const handleMouseLeave = useCallback(() => {
    if (anchorEl) {
      setAnchorEl(null)
    }
  }, [anchorEl])

  return (
    <>
      <IconButton
        aria-describedby={id}
        aria-label="image"
        color="primary"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon className={`fa-image ${open && isFetching ? 'fa-spin' : ''}`} sx={{ fontSize: 18 }} />
      </IconButton>
      <Popover
        id={id}
        open={open && !isFetching}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        style={{ pointerEvents: 'none' }}
        disableRestoreFocus
        hideBackdrop
      >
        <Paper sx={{ p: 2 }}>
          <ProductImage img={image} height={120} />
        </Paper>
      </Popover>
    </>
  )
}
