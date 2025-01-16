import type { ActionStore } from '@/api/types.generated'
import Typography from '@mui/material/Typography'
import { defineMessages, FormattedMessage } from 'react-intl'
import { RecItem } from '@/components/SwapSummaryModal/RecItem'
import { useGroupQuery } from '@/hooks/arteli'
import { actionStoreToProductFlags } from '@/utils/productFlags'

const messages = defineMessages({
  current: { defaultMessage: 'Current Swap', id: '9chQpc' }
})

export const SwapInfo = ({
  addActionStore,
  removeActionStore
}: {
  addActionStore: ActionStore
  removeActionStore: ActionStore | null
}) => {
  const { data: addGroup } = useGroupQuery({
    params: { id: addActionStore.groupId ?? '' },
    enabled: Boolean(addActionStore.groupId)
  })

  const { data: removeGroup } = useGroupQuery({
    params: { id: removeActionStore?.groupId ?? '' },
    enabled: Boolean(removeActionStore?.groupId)
  })

  return (
    <>
      <Typography fontSize={18} mb={2}>
        <FormattedMessage {...messages.current} />
      </Typography>
      <RecItem
        actionType="Add"
        name={addGroup?.name}
        pastSales={addActionStore.pastSales}
        predictedSales={addActionStore.predictedSales ?? undefined}
        productFlags={actionStoreToProductFlags(addActionStore)}
        gutterBottom
        tags={addActionStore.productTagsAny}
      />
      <RecItem
        actionType="Remove"
        name={removeGroup?.name}
        pastSales={removeActionStore?.pastSales}
        predictedSales={removeActionStore?.predictedSales ?? undefined}
        productFlags={actionStoreToProductFlags(removeActionStore)}
        gutterBottom
        tags={removeActionStore?.productTagsAny}
      />
    </>
  )
}
