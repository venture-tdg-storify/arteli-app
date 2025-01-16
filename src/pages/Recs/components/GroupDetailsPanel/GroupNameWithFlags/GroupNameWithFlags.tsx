import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ProductFlags, type Group } from '@/api/arteli'
import ClearanceIcon from '@/components/ClearanceIcon'
import ProductFlagsList from '@/components/ProductFlagsList'

export function GroupNameWithFlags({
  name,
  flags: allFlags,
  clearance = 0,
  clearanceAndSale = 0,
  tags = []
}: {
  name: Group['name']
  flags: number[]
  clearance?: number
  clearanceAndSale?: number
  tags?: string[]
}) {
  const flags = useMemo(() => allFlags.reduce((flag, current) => flag | current, ProductFlags.None), [allFlags])

  return (
    <Stack direction="column" alignItems="start">
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 24, my: 2 }}>{name}</Typography>
        {Boolean(clearance) && (
          <Box pr={1}>
            <ClearanceIcon count={clearance} clearanceAndSale={false} />
          </Box>
        )}
        {Boolean(clearanceAndSale) && (
          <Box pr={1}>
            <ClearanceIcon count={clearanceAndSale} />
          </Box>
        )}
        <ProductFlagsList flags={flags} />
      </Stack>

      {Boolean(tags) && (
        <Typography variant="body1" fontStyle="italic" color="textSecondary">
          {tags.join(', ')}
        </Typography>
      )}
    </Stack>
  )
}
