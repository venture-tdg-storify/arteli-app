import type { Category } from '@/api/types.generated'
import { useCallback } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'

const messages = defineMessages({
  hint: {
    defaultMessage:
      'Input your operating cost per category to filter out series that fall below the specified cost. Disclaimer: If there is no input for a category, the operating cost will default to $0.',
    id: 'F1fSYP'
  },
  category: { defaultMessage: 'Category', id: 'ccXLVi' },
  operatingCost: { defaultMessage: 'Operating Cost', id: 'mS2Nmq' }
})

const StyleTextField = styled(TextField)(() => ({
  '.MuiInputBase-input': {
    padding: 0
  }
}))

export const ROICalculation = ({
  categories,
  onChange
}: {
  categories: Category[]
  onChange: (id: string, value: string) => void
}) => {
  const handleChange = useCallback(
    (value: string, id: string) => {
      onChange(id, value)
    },
    [onChange]
  )

  return (
    <>
      <Typography sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 20, mt: 6, mb: 1 })}>
        <FormattedMessage {...messages.operatingCost} />
      </Typography>
      <Typography mb={1}>
        <FormattedMessage {...messages.hint} />
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 500 }}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage {...messages.category} />
              </TableCell>
              <TableCell>
                <FormattedMessage {...messages.operatingCost} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ borderBottom: 'none' }}>
                  {category.name}
                </TableCell>
                <TableCell align="left" sx={{ borderBottom: 'none' }}>
                  <StyleTextField
                    margin="none"
                    variant="standard"
                    type="number"
                    size="small"
                    value={category.operatingCost}
                    onChange={(e) => handleChange(e.target.value, category.id)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                    sx={{ maxWidth: 120, pt: 1 }}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
