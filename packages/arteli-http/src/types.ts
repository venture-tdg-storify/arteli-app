export type GenericParams = Record<string, string | number> | undefined
export type GenericHeaders = Record<string, string>
export type GenericBody = unknown

export class HttpError extends Error {
  constructor(
    message: string,
    public request: globalThis.Request,
    public response: globalThis.Response,
    cause?: Error
  ) {
    super(message, cause)
    this.name = 'HttpError'
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type Request<Body, Params, Headers> = {
  url: string
  method: HttpMethod
  params?: Params
  body?: Body
  headers?: Headers
}

export type Response<Body> = {
  body: Body
  ok: boolean
  status: number
  request: globalThis.Request
  response: globalThis.Response
}
