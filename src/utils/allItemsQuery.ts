import type { PaginatedRequest } from '@/api/arteli'
import type { Req } from '@arteli/http'
import type { QueryKey } from '@tanstack/react-query'
import { useQuery as useQuery_ } from '@tanstack/react-query'
import { MAX_PER_PAGE } from '@/config/api.config'

export const fetchAllFactory = <Params extends PaginatedRequest, Headers, RequestBody, T>({
  handler,
  limit = MAX_PER_PAGE
}: {
  handler: ReturnType<typeof Req<Params, Headers, RequestBody, T[]>>
  limit?: number
}) => {
  type RequestInfo = {
    body?: RequestBody
    params?: Params
    headers?: Headers
    signal?: AbortSignal
  }

  const fetchAll = async ({ signal, body, headers, params }: RequestInfo) => {
    const pages: T[][] = []
    let items: T[] = []

    do {
      items = await handler({
        body,
        headers,
        params: { ...params, limit, offset: pages.length * limit } as Params,
        signal
      })

      pages.push(items)
    } while (items?.length === limit)

    return pages.flat()
  }

  return fetchAll
}

export const allItemsQuery = <Params extends PaginatedRequest, Headers, RequestBody, T>(
  handler: ReturnType<typeof Req<Params, Headers, RequestBody, T[]>>,
  {
    limit = MAX_PER_PAGE,
    staleTime,
    refetchInterval,
    refetchOnMount,
    refetchOnWindowFocus,
    gcTime
  }: {
    limit?: number
    staleTime?: number
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
    meta?: unknown
    refetchOnMount?: boolean
    gcTime?: number
  } = {}
) => {
  const fetchAll = fetchAllFactory({ handler, limit })

  const useQuery = (
    { body, params, headers, enabled }: Omit<Parameters<typeof fetchAll>['0'], 'signal'> & { enabled?: boolean } = {},
    queryKey?: QueryKey
  ) =>
    useQuery_({
      queryKey: queryKey ? queryKey : [...handler.getQueryKey(params), 'all'],
      queryFn: async ({ signal }) => fetchAll({ body, params, headers, signal }),
      enabled,
      staleTime,
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      gcTime
    })

  return useQuery
}
