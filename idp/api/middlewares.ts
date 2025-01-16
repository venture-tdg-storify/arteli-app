import type { Request } from '@arteli/http'
import { random } from '@arteli/utils'
import { session } from '@/store/auth'

export type AuthorizationHeaders = {
  Authorization: string
}

export const withGlobalAuthorization = <Params, Headers extends AuthorizationHeaders, RequestBody>(
  req: Request<RequestBody, Params, Headers>,
  next: () => void
) => {
  req.headers = req.headers || ({} as Headers)

  req.headers.Authorization = `Bearer ${session.get('tokens')?.idToken ?? ''}`

  next()
}

export type TracingHeaders = { 'X-Tracing-Id': string }

export const withTracingId = <Params, Headers extends TracingHeaders, RequestBody>(
  req: Request<RequestBody, Params, Headers>,
  next: () => void
) => {
  req.headers = req.headers || ({} as Headers)

  req.headers['X-Tracing-Id'] = random.String

  next()
}
