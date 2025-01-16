import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Loader from '@/components/Loader'

export function GlobalLoader() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  if (isFetching || isMutating) {
    return <Loader />
  }

  return null
}
