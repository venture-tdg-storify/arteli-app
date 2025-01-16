import type { Middleware } from './middlewares'
import type * as Arteli from './types'
import { Get, Put, Post, Delete } from './http'

export const Api = <DefaultHeaders = unknown>({
  beforeMiddlewares = [],
  afterMiddlewares = []
}: {
  beforeMiddlewares?: Middleware<unknown>[]
  afterMiddlewares?: Middleware<unknown>[]
} = {}) => {
  const api = {
    Get: <ResponseBody, Params = unknown, Headers = DefaultHeaders>(url: string) =>
      Get<ResponseBody, Params, Headers>(url, {
        beforeMiddlewares: beforeMiddlewares as Middleware<Arteli.Request<void, Params, Headers>>[],
        afterMiddlewares: afterMiddlewares as Middleware<Arteli.Response<ResponseBody>>[]
      }),
    Delete: <ResponseBody, Params, Headers = DefaultHeaders>(url: string) =>
      Delete<ResponseBody, Params, Headers>(url, {
        beforeMiddlewares: beforeMiddlewares as Middleware<Arteli.Request<void, Params, Headers>>[],
        afterMiddlewares: afterMiddlewares as Middleware<Arteli.Response<ResponseBody>>[]
      }),
    Post: <ResponseBody, RequestBody, Params = unknown, Headers = DefaultHeaders>(url: string) =>
      Post<ResponseBody, RequestBody, Params, Headers>(url, {
        beforeMiddlewares: beforeMiddlewares as Middleware<Arteli.Request<RequestBody, Params, Headers>>[],
        afterMiddlewares: afterMiddlewares as Middleware<Arteli.Response<ResponseBody>>[]
      }),
    Put: <ResponseBody, RequestBody, Params = unknown, Headers = DefaultHeaders>(url: string) =>
      Put<ResponseBody, RequestBody, Params, Headers>(url, {
        beforeMiddlewares: beforeMiddlewares as Middleware<Arteli.Request<RequestBody, Params, Headers>>[],
        afterMiddlewares: afterMiddlewares as Middleware<Arteli.Response<ResponseBody>>[]
      }),
    useBefore: (middleware: unknown) => {
      beforeMiddlewares.push(middleware as unknown as Middleware<unknown>)

      return api
    },
    useAfter: (middleware: unknown) => {
      afterMiddlewares.push(middleware as unknown as Middleware<unknown>)

      return api
    }
  }

  return api
}
