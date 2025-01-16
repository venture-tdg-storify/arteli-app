import type { PaginatedRequest } from '@/api/arteli'
import type { Req } from '@arteli/http'
import type { QueryKey } from '@tanstack/react-query'
import { useQuery as useQuery_ } from '@tanstack/react-query'
import { unique } from '.'

const MAX_PER_PAGE = 500 // url query param limit
const _5_MINUTES = 5 * 60 * 1000

type RequestParams = PaginatedRequest<{ ids?: string[] }>

const splitIds = (ids: string[], limit: number) => {
  const sortedIds = ids.sort()

  return Array.from({ length: Math.ceil(ids.length / limit) }).map((_, i) =>
    sortedIds.slice(i * limit, (i + 1) * limit)
  )
}

export type ICache<T> = {
  getById: (id: string) => T | undefined
  getByIds: (ids: string[]) => T[]
  add: (entity: T) => void
}

export const fetchAllIdsFactory = <Params extends RequestParams, Headers, RequestBody, T extends { id: string }>({
  handler,
  cache,
  limit = MAX_PER_PAGE
}: {
  handler: ReturnType<typeof Req<Params, Headers, RequestBody, T[]>>
  limit?: number
  cache: ICache<T>
}) => {
  type RequestInfo = {
    body?: RequestBody
    params?: Params
    headers?: Headers
    signal?: AbortSignal
  }

  const fetchAllIds = async ({ signal, body, headers, params }: RequestInfo) => {
    const ids = unique(params?.ids ?? []).sort()

    const missingIds = ids.filter((id) => !cache.getById(id))

    const pages = await Promise.all(
      splitIds(missingIds, limit).map((ids) =>
        handler({ body, headers, params: { ...params, limit, ids } as Params, signal })
      )
    )

    pages.flat().forEach(cache.add)

    return cache.getByIds(ids)
  }

  return fetchAllIds
}

export const allIdsQuery = <Params extends RequestParams, Headers, RequestBody, T extends { id: string }>(
  handler: ReturnType<typeof Req<Params, Headers, RequestBody, T[]>>,
  cache: ICache<T>,
  limit: number = MAX_PER_PAGE
) => {
  const fetchAll = fetchAllIdsFactory({ handler, limit, cache })

  const useQuery = (
    {
      body,
      params,
      headers,
      enabled,
      staleTime = _5_MINUTES,
      refetchOnWindowFocus = false
    }: Omit<Parameters<typeof fetchAll>['0'], 'signal'> & {
      enabled?: boolean
      staleTime?: number
      refetchOnWindowFocus?: boolean
    } = {},
    queryKey?: QueryKey
  ) =>
    useQuery_({
      queryKey: queryKey ? queryKey : [...handler.getQueryKey(params), 'all'],
      queryFn: async ({ signal }) => fetchAll({ body, params, headers, signal }),
      enabled,
      staleTime,
      refetchOnWindowFocus
    })

  return useQuery
}
