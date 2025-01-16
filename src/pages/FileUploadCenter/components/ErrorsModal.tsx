import type { UserJobErrorItem } from '@/api/types.generated'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
// import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { FormattedMessage, defineMessages } from 'react-intl'
import Modal from '@/components/Modal'

const messages = defineMessages({
  errors: { defaultMessage: 'Errors', id: 'Rdlh9D' },
  description: { defaultMessage: 'The following errors occurred during file processing', id: 'omQ8up' },
  error: { defaultMessage: 'Error', id: 'KN7zKn' },
  row: { defaultMessage: 'Row', id: '0VkWFp' }
})

export const ErrorsModal = ({
  onClose,
  open,
  errors
}: {
  onClose: () => unknown
  open: boolean
  errors: UserJobErrorItem[]
}) => {
  return (
    <Modal
      title={<FormattedMessage {...messages.errors} />}
      description={<FormattedMessage {...messages.description} />}
      open={open}
      onClose={onClose}
      size="xLarge"
    >
      <TableContainer component="div" sx={{ maxHeight: `calc(100vh - 300px)` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage {...messages.error} />
              </TableCell>
              <TableCell>
                <FormattedMessage {...messages.row} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map(({ error, target }) => (
              <TableRow key={target}>
                <TableCell>{error}</TableCell>
                <TableCell>{target}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  )
}
