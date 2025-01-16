import type { ProductTagWithUIConfig } from './useTags'
import type { ActionType } from '@/api/types.generated'
import { useCallback } from 'react'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'

const messages = defineMessages({
  businessRules: { defaultMessage: 'Business Rules', id: 'MsomRU' },
  recommendationsHint: {
    defaultMessage:
      'Based off of your CSV upload, you can select the tags that you want to utilize in the Business Monitor.',
    id: 'JiWpl1'
  },
  productTags: { defaultMessage: 'Product Tags', id: 'iWvEIS' },
  addRec: { defaultMessage: 'Add Recommendation Filter', id: '2tv3Zn' },
  removeRec: { defaultMessage: 'Remove Recommendation Filter', id: 'Ws7dwN' },
  empty: { defaultMessage: 'No Tags available', id: 'w59sSw' },
  loading: { defaultMessage: 'Loading...', id: 'gjBiyj' },
  showLabel: { defaultMessage: 'Show Label', id: 'LztZGF' }
})

export const Recommendations = ({
  tags,
  isFetching,
  onTagChange,
  onShowChange
}: {
  tags: ProductTagWithUIConfig[]
  isFetching: boolean
  onTagChange: (id: string, type: ActionType, value: boolean) => void
  onShowChange: (id: string, value: boolean) => void
}) => {
  const handleShowChange = useCallback(
    (id: string, value: boolean) => {
      onShowChange(id, value)
    },
    [onShowChange]
  )

  const handleTagChange = useCallback(
    (id: string, type: ActionType, value: boolean) => {
      onTagChange(id, type, value)
    },
    [onTagChange]
  )

  return (
    <>
      <Typography sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold, fontSize: 20, mt: 6, mb: 1 })}>
        <FormattedMessage {...messages.businessRules} />
      </Typography>
      <Typography mb={1}>
        <FormattedMessage {...messages.recommendationsHint} />
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3, maxWidth: 760 }}>
        <Table size="small" aria-label="simple table">
          {tags.length === 0 && (
            <caption>
              <Typography padding={2} textAlign="center">
                <FormattedMessage {...(isFetching ? messages.loading : messages.empty)} />
              </Typography>
            </caption>
          )}
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage {...messages.productTags} />
              </TableCell>
              <TableCell>
                <FormattedMessage {...messages.showLabel} />
              </TableCell>
              <TableCell>
                <FormattedMessage {...messages.addRec} />
              </TableCell>
              <TableCell>
                <FormattedMessage {...messages.removeRec} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...tags]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((tag) => (
                <TableRow key={tag.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" sx={{ borderBottom: 'none' }}>
                    {tag.name === 'Disco' ? 'Discontinued' : tag.name}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                    <Checkbox checked={tag.show} onChange={(_, value) => handleShowChange(tag.id, value)} />
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                    <Checkbox
                      checked={tag.filters.includes('Add')}
                      onChange={(_, value) => handleTagChange(tag.id, 'Add', value)}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                    <Checkbox
                      checked={tag.filters.includes('Remove')}
                      onChange={(_, value) => handleTagChange(tag.id, 'Remove', value)}
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
