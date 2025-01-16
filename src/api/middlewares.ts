import type { Request } from '@arteli/http'
import { session } from '@/store/auth'
import { settings } from '@/store/settings'

export type AuthorizationHeaders = {
  Authorization: string
  'Arteli-Tenant-User-Id': string
}

export const withGlobalAuthorization = <Params, Headers extends AuthorizationHeaders, RequestBody>(
  req: Request<RequestBody, Params, Headers>,
  next: () => void
) => {
  req.headers = req.headers || ({} as Headers)

  const tenantUserId = settings.get('tenantUserId')!

  req.headers.Authorization = `Bearer ${session.get('tokens')?.idToken ?? ''}`
  req.headers['Arteli-Tenant-User-Id'] = tenantUserId

  next()
}

export type TracingHeaders = { 'X-Tracing-Id': string }

export const withTracingId = <Params, Headers extends TracingHeaders, RequestBody>(
  req: Request<RequestBody, Params, Headers>,
  next: () => void
) => {
  req.headers = req.headers || ({} as Headers)

  req.headers['X-Tracing-Id'] = Math.random().toString(36).substring(2, 15)

  next()
}
