import type { AuthorizationHeaders } from './middlewares'
import type { Request } from '@arteli/http'
import { Api, withDynamicUrl, withBaseUrl } from '@arteli/http'
import { domain } from '@/config/auth.config'
import { session } from '@/store/auth'

export type User = {
  created_at: string
  email: string
  email_verified: boolean
  identities: {
    connection: string
    provider: string
    user_id: string
    isSocial: boolean
  }[]
  name: string
  nickname: string
  picture: string
  updated_at: string
  user_id: string
  last_ip: string
  last_login: string
  logins_count: number
}

export const withGlobalAuthorization = <Params, Headers extends AuthorizationHeaders, RequestBody>(
  req: Request<RequestBody, Params, Headers>,
  next: () => void
) => {
  req.headers = req.headers || ({} as Headers)

  req.headers.Authorization = `Bearer ${session.get('tokens')?.accessToken ?? ''}`

  next()
}

const auth0Api = Api<AuthorizationHeaders>()
  .useBefore(withDynamicUrl())
  .useBefore(withBaseUrl(`https://${domain}/api/v2`))
  .useBefore(withGlobalAuthorization)

export const Auth0 = {
  Users: {
    findOne: auth0Api.Get<User, { userId: string }>('users/:userId')
  }
}
