import type { Middleware } from './middlewares'
import type * as Arteli from './types'
import { Req } from './req'

const WithoutBody =
  (method: Arteli.HttpMethod) =>
  <ResponseBody, Params, Headers>(
    url: string,
    {
      beforeMiddlewares = [],
      afterMiddlewares = []
    }: {
      beforeMiddlewares?: Middleware<Arteli.Request<void, Params, Headers>>[]
      afterMiddlewares?: Middleware<Arteli.Response<ResponseBody>>[]
    } = {}
  ) => {
    return Req<Params, Headers, void, ResponseBody>({ url, method, beforeMiddlewares, afterMiddlewares })
  }

const WithBody =
  (method: Arteli.HttpMethod) =>
  <ResponseBody, RequestBody, Params, Headers>(
    url: string,
    {
      beforeMiddlewares = [],
      afterMiddlewares = []
    }: {
      beforeMiddlewares?: Middleware<Arteli.Request<RequestBody, Params, Headers>>[]
      afterMiddlewares?: Middleware<Arteli.Response<ResponseBody>>[]
    } = {}
  ) => {
    return Req<Params, Headers, RequestBody, ResponseBody>({ url, method, beforeMiddlewares, afterMiddlewares })
  }

export const Get = WithoutBody('GET')
export const Delete = WithoutBody('DELETE')
export const Post = WithBody('POST')
export const Put = WithBody('PUT')
