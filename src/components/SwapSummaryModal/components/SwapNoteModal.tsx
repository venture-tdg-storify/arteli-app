import type { Row } from '../useRows'
import { useCallback, useState } from 'react'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Note } from '@/components/Notes/Note'
import ConfirmModal from '../../ConfirmModal'
import { RecItem } from '../RecItem'

const messages = defineMessages({
  title: { defaultMessage: 'Edit Swap Note', id: 'O0yFmY' },
  confirm: { defaultMessage: 'Confirm', id: 'N2IrpM' },
  current: { defaultMessage: 'Current Swap', id: '9chQpc' },
  notes: { defaultMessage: 'Swap Note', id: 'EYvht3' }
})

export const SwapNoteModal = ({
  open,
  note,
  onClose,
  onConfirm
}: {
  open: boolean
  note?: Row
  onClose: () => void
  onConfirm: (text: string) => void
}) => {
  const [content, setContent] = useState(note?.note ?? '')

  const handleConfirm = useCallback(() => {
    onConfirm(content)
  }, [content, onConfirm])

  return (
    <ConfirmModal
      title={
        <Typography fontSize={20} fontWeight="bold">
          <FormattedMessage {...messages.title} />
        </Typography>
      }
      description={
        <Typography fontSize={16} fontWeight="bold">
          {note?.store.externalId + ' ' + note?.store.name}
        </Typography>
      }
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      size="large"
      topMargin={3}
      inverted
      hideSkipButton={true}
    >
      <Typography fontSize={18} mb={2}>
        <FormattedMessage {...messages.current} />
      </Typography>
      {/* <RecItem
        actionType="Add"
        name={data?.group.externalId}
        pastSales={data?.addRecGroup.pastSalesSumOverFilteredAddableStores}
        predictedSales={data?.addRecGroup.predictedSalesSumOverFilteredAddableStores}
        productFlagsAny={data?.addRecGroup.productFlagsAny}
        gutterBottom
      /> */}
      <RecItem
        actionType="Remove"
        name={note?.group?.externalId}
        pastSales={note?.recGroup?.pastSales}
        predictedSales={note?.recGroup?.predictedSales}
        productFlags={note?.recGroup?.productFlagsAny}
        gutterBottom
      />
      <Typography fontSize={18} mb={1}>
        <FormattedMessage {...messages.notes} />
      </Typography>
      <Note onNoteChange={setContent} note={content} />
    </ConfirmModal>
  )
}
