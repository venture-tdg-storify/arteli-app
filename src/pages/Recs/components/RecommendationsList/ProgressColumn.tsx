import type { Row } from '../../useRows'
import type { LinearProgressProps } from '@mui/material/LinearProgress'
import type { GridRenderCellParams } from '@mui/x-data-grid-pro'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

const barColors = [
  '#a50026',
  '#d73027',
  '#f46d43',
  '#fdae61',
  '#fee08b',
  '#ffffbf',
  '#d9ef8b',
  '#a6d96a',
  '#66bd63',
  '#1a9850',
  '#006837'
]

const Base = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  justifyContent: 'start'
}))

const StyledLinearProgress = styled(LinearProgress)<LinearProgressProps & { progress: string }>(
  ({ theme: { palette }, progress }) => ({
    width: '100%',
    height: 24,
    borderRadius: 2,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: palette.grey[100]
    },
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: progress
    }
  })
)

const getConfidence = (row: Row) =>
  row.rec ? row.rec.predictedSalesSumOverFilteredAddableStores / row.rec.storeIdsOverFilteredAddableStores.length : null

export function ProgressColumn({ row, api }: GridRenderCellParams<Row, string>) {
  const currentRow = getConfidence(row)
  const topRow = getConfidence(api.getRow(api.getRowIdFromRowIndex(0)) as Row)

  if (currentRow === null || topRow === null) return null

  const progress = Math.round((currentRow * 100) / topRow)

  return (
    <Base>
      <StyledLinearProgress variant="determinate" value={progress} progress={barColors[Math.round(progress / 10)]} />
    </Base>
  )
}
