import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { defineMessages, FormattedMessage } from 'react-intl'

const messages = defineMessages({
  loadMore: { defaultMessage: 'Load More Recommendations', id: 'b23pId' }
})

export const LoadMoreButton = ({
  hasMore,
  onLoadMore,
  isFetching
}: {
  hasMore: boolean
  onLoadMore: () => void
  isFetching: boolean
}) => {
  return (
    <Stack sx={{ width: '100%', justifyContent: 'center' }}>
      {hasMore && (
        <Button
          onClick={onLoadMore}
          disabled={isFetching}
          sx={{ textDecoration: 'underline', fontSize: 20, color: 'text.primary' }}
        >
          <FormattedMessage {...messages.loadMore} />
        </Button>
      )}
    </Stack>
  )
}
