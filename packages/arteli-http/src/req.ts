import type { Middleware } from './middlewares'
import type { QueryKey, UseMutationOptions } from '@tanstack/react-query'
import { useQuery as useQuery_, useMutation as useMutation_, useQueryClient } from '@tanstack/react-query'
import { execMiddlewares } from './middlewares'
import * as Arteli from './types'
import { getUrl } from './url'

export const request = async <ResponseBody>(req: Request): Promise<Arteli.Response<ResponseBody>> => {
  const res = await fetch(req)

  if (!res.ok) {
    throw new Arteli.HttpError(res.statusText, req, res)
  }

  let responseBody = await res.text()

  try {
    if (res.headers.get('content-type')?.includes('application/json')) {
      responseBody = JSON.parse(responseBody)
    }
  } catch (err) {
    throw new Arteli.HttpError('Not a valid JSON', req, res, err as Error)
  }

  return { body: responseBody as ResponseBody, ok: res.ok, status: res.status, request: req, response: res }
}

export const Req = <
  Params = unknown,
  Headers = unknown,
  RequestBody = unknown,
  ResponseBody = unknown,
  SelectedBody = ResponseBody
>(
  {
    method,
    url,
    beforeMiddlewares = [],
    afterMiddlewares = []
  }: {
    url: string
    method: Arteli.HttpMethod
    beforeMiddlewares?: Middleware<Arteli.Request<RequestBody, Params, Headers>>[]
    afterMiddlewares?: Middleware<Arteli.Response<ResponseBody>>[]
  },
  selector: (response: Arteli.Response<ResponseBody>) => SelectedBody = (response: Arteli.Response<ResponseBody>) =>
    response.body as unknown as SelectedBody
) => {
  type RequestInfo = {
    body?: RequestBody
    params?: Params
    headers?: Headers
    signal?: AbortSignal
  }

  const handler = async ({ body, params, headers, signal }: RequestInfo = {}): Promise<SelectedBody> => {
    const req = await execMiddlewares<Arteli.Request<RequestBody, Params, Headers>>(
      { url, method, params, headers, body },
      beforeMiddlewares
    )

    const response = await request<ResponseBody>(
      new Request(req.url, {
        method: req.method,
        headers: req.headers ?? {},
        body: req.body instanceof FormData ? req.body : JSON.stringify(req.body), // Check how to make this generic
        signal
      })
    )

    return selector(await execMiddlewares(response, afterMiddlewares))
  }

  handler.useBefore = (middleware: Middleware<Arteli.Request<RequestBody, Params, Headers>>) => {
    beforeMiddlewares.push(middleware)
    return handler
  }

  handler.useAfter = (middleware: Middleware<Arteli.Response<ResponseBody>>) => {
    afterMiddlewares.push(middleware)
    return handler
  }

  handler.select = <SelectedValue>(
    selector: (response: Arteli.Response<ResponseBody>) => SelectedValue,
    keySuffix: string
  ) => {
    const handler = Req<Params, Headers, RequestBody, ResponseBody, SelectedValue>(
      { url, method, beforeMiddlewares, afterMiddlewares },
      selector
    )

    const getQueryKey = handler.getQueryKey

    handler.getQueryKey = (params?: Params) => [...getQueryKey(params), keySuffix]

    return handler
  }

  handler.getQueryKey = (params?: Params) => getUrl(url, params).split(/[/?]/)

  /**
   * @beta not sure if this is good enough long term
   * @returns A function that can be used as a react-query queryFn
   */
  handler.asQuery = ({ defaultStaleTime }: { defaultStaleTime?: number } = {}) => {
    const useQuery = (
      {
        body,
        params,
        headers,
        enabled,
        staleTime = defaultStaleTime,
        refetchOnWindowFocus
      }: RequestInfo & { enabled?: boolean; staleTime?: number; refetchOnWindowFocus?: boolean } = {},
      queryKey: QueryKey = []
    ) =>
      useQuery_({
        queryKey: [...handler.getQueryKey(params), ...[queryKey].flat()].filter((_) => _ !== undefined),
        queryFn: ({ signal }) => handler({ body, params, headers, signal }),
        enabled,
        staleTime,
        refetchOnWindowFocus
      })

    return useQuery
  }

  handler.asQueryParams = (
    { body, params, headers, enabled, staleTime }: RequestInfo & { enabled?: boolean; staleTime?: number } = {},
    queryKey: QueryKey = []
  ) => {
    return {
      queryKey: [...handler.getQueryKey(params), ...[queryKey].flat()].filter((_) => _ !== undefined),
      queryFn: ({ signal }: { signal: AbortSignal }) => handler({ body, params, headers, signal }),
      enabled,
      staleTime
    }
  }

  handler.asMutation = () => {
    const useMutation = (
      options: Omit<UseMutationOptions<SelectedBody, Arteli.HttpError, RequestInfo>, 'mutationFn'> = {}
    ) => {
      const queryClient = useQueryClient()

      return useMutation_<SelectedBody, Arteli.HttpError, RequestInfo>({
        ...options,
        mutationFn: ({ body, params, headers, signal } = {}) => {
          return handler({ body, params, headers, signal })
        },
        mutationKey: [url, ...[options.mutationKey].flat()].filter((_) => _ !== undefined),
        onSettled: async (data, error, variables, context) => {
          await options.onSettled?.(data, error, variables, context)

          const queryKey = handler.getQueryKey(variables.params)

          // console.log('❌ Invalidating Query', queryKey)

          await queryClient.invalidateQueries({ queryKey })
        }
      })
    }

    return useMutation
  }

  handler.getUrl = () => url

  return handler
}
