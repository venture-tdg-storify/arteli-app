import type * as Arteli from './types'
import { getUrl } from './url'

export type Middleware<Context> = (ctx: Context, next: () => void) => void

export const execMiddlewares = async <Context>(context: Context, middlewares: Middleware<Context>[]) => {
  for (const middleware of middlewares) {
    await new Promise<void>((resolve) => middleware(context, resolve))
  }

  return context
}

export const withBaseUrl =
  (baseUrl: string) =>
  <Params, Headers, RequestBody>(req: Arteli.Request<RequestBody, Params, Headers>, next: () => void) => {
    req.url = baseUrl + '/' + req.url

    next()
  }

export const withDefaultHeaders =
  <DefaultHeaders>(defaultHeaders: DefaultHeaders) =>
  <Params, Headers extends DefaultHeaders, RequestBody>(
    req: Arteli.Request<RequestBody, Params, Headers>,
    next: () => void
  ) => {
    req.headers = {
      ...defaultHeaders,
      ...req.headers
    } as Headers

    next()
  }

export const contentTypeHeaders = <Params, Headers, RequestBody>(
  req: Arteli.Request<RequestBody, Params, Headers>,
  next: () => void
) => {
  req.headers = {
    ...req.headers,
    ...(req.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' })
  } as Headers

  next()
}

export const withDynamicUrl =
  () =>
  <Params, Headers, RequestBody>(req: Arteli.Request<RequestBody, Params, Headers>, next: () => void) => {
    req.url = getUrl(req.url, req.params)

    next()
  }
