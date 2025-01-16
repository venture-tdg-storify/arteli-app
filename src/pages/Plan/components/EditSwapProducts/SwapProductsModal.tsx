import type { ActionStore, Product, Store } from '@/api/types.generated'
import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import ConfirmModal from '@/components/ConfirmModal'
import { ProductSelection } from '@/components/ProductsSelection'
import { SwapInfo } from '../SwapInfo'
import { useRows } from './useRows'

const messages = defineMessages({
  title: { defaultMessage: 'Edit Swap Products', id: 'R/kQXi' },
  confirm: { defaultMessage: 'Confirm', id: 'N2IrpM' },
  current: { defaultMessage: 'Current Swap', id: '9chQpc' },
  products: { defaultMessage: 'Swap Products', id: 'lwaa2g' }
})

export const SwapProductsModal = ({
  addActionStore,
  removeActionStore,
  store,
  isPending,
  onCancel,
  onConfirm,
  open = true
}: {
  addActionStore: ActionStore
  removeActionStore: ActionStore | null
  store: Store
  isPending: boolean
  onConfirm: (products: Product['id'][]) => void
  onCancel: () => void
  open?: boolean
}) => {
  const [productIds, setProductIds] = useState<Product['id'][]>(addActionStore.productIds)

  const handleConfirm = useCallback(() => {
    onConfirm(productIds)
  }, [productIds, onConfirm])

  const handleChangeProducts = useCallback((productIds: readonly Product['id'][]) => {
    setProductIds([...productIds])
  }, [])

  return (
    <ConfirmModal
      title={
        <Typography fontSize={20} fontWeight="bold">
          <FormattedMessage {...messages.title} />
        </Typography>
      }
      description={
        <Typography fontSize={16} fontWeight="bold">
          {store.externalId + ' ' + store.name}
        </Typography>
      }
      open={open}
      onClose={onCancel}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      confirmLabel={<FormattedMessage {...messages.confirm} />}
      size="large"
      topMargin={3}
      inverted
      hideSkipButton={true}
      confirming={isPending}
    >
      <SwapInfo addActionStore={addActionStore} removeActionStore={removeActionStore} />
      <Typography fontSize={18} mb={1}>
        <FormattedMessage {...messages.products} />
      </Typography>
      <Box sx={{ width: '100%', height: 'calc(100vh - 550px)' }}>
        <ProductSelection
          value={productIds}
          onChange={handleChangeProducts}
          groupId={addActionStore.groupId}
          storeIds={[store.id]}
          dataFetcher={useRows}
        />
      </Box>
    </ConfirmModal>
  )
}
