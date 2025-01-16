import Stack from '@mui/material/Stack'
import { ProductFlags } from '@/api/arteli'
import FlagChip from '@/components/FlagChip'

const defaultAllowedFlags = [ProductFlags.Exclusive, ProductFlags.New]

export function ProductFlagsList({
  flags,
  allowedFlags = defaultAllowedFlags
}: {
  flags: number
  allowedFlags?: ProductFlags[]
}) {
  const allowedFlagsMask = allowedFlags.reduce((acc, flag) => acc | flag, ProductFlags.None)

  if (!(flags & allowedFlagsMask)) return null

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="start" ml={1}>
      {allowedFlags
        .filter((_) => flags & _)
        .map((flag) => (
          <FlagChip flag={flag} key={flag} />
        ))}
    </Stack>
  )
}
