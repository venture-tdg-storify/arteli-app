import type { GetTokenSilentlyVerboseResponse, GenericError } from '@auth0/auth0-spa-js'
import { State } from '@arteli/state'
import { getLocalValue, removeLocalValue, setLocalValue } from '@arteli/utils'
import { Auth0Client } from '@auth0/auth0-spa-js'
import days from 'dayjs'
import { domain, clientId, audience, scope } from '@/config/auth.config'
import { parseJWTToken } from '@/utils'
import analytics from '@/utils/analytics'
import { tab } from './tab'

const ARTELI_SESSION_KEY = 'arteli-session' // Key for localStorage

export type Tokens = { accessToken: string; idToken: string; expiresAt: number | null }
export type User = { sub: string; email: string }
type Session = { tokens: Tokens | null; user: User | null }

export const auth0 = new Auth0Client({
  domain,
  clientId,
  authorizationParams: { scope, audience, redirect_uri: `${window.location.origin}/auth` }
})

const VERSION = 1

export const getFromLocalStorage = (): Tokens | null => {
  const tokens = getLocalValue<Tokens | null>(ARTELI_SESSION_KEY, VERSION, null)

  if (tokens?.expiresAt && days().isBefore(days.unix(tokens.expiresAt))) {
    return tokens
  }

  // console.debug('Tokens does not exist or expired', tokens?.expiresAt)

  return null
}

export const session = new State<Session>({
  tokens: null,
  user: null
})

let timeout: NodeJS.Timeout

session.subscribe(() => {
  // console.debug('🔑 Auth changed', ...args)

  const { tokens } = session.getSnapshot()

  clearTimeout(timeout)

  if (tokens === null) {
    // console.log('❌ Removing session from localStorage')
    removeLocalValue(ARTELI_SESSION_KEY)
    return
  }

  if (tokens?.expiresAt) {
    let expiresInMs = days
      .unix(tokens.expiresAt)
      .subtract(Math.random() * 5, 'minutes')
      .diff(days(), 'ms')

    expiresInMs = Math.min(expiresInMs, Math.pow(2, 31) - 1)

    // console.log('⌛ Setting timeout for token reload', days().add(expiresInMs, 'ms').format('HH:mm:ss'))

    setTimeout(reloadTokens, expiresInMs)
  }
})

export const login = () =>
  auth0.loginWithRedirect({
    appState: { returnTo: window.location.pathname }
  })

export const logout = async ({ returnTo }: { returnTo: string }) => {
  await analytics?.track('User Logged Out', { id: session.get('user')?.sub })
  await auth0.logout({ logoutParams: { returnTo } })
  setTokens(null)
}

export const getReturnToUrl = async (): Promise<string> => {
  const { appState } = await auth0.handleRedirectCallback()

  return appState?.returnTo
}

export const HashToTokens = (authHash: Omit<GetTokenSilentlyVerboseResponse, 'expires_in'>): Tokens => ({
  accessToken: authHash.access_token!,
  idToken: authHash.id_token!,
  expiresAt: getExpirationFromToken(authHash.id_token!)
})

export const setTokens = (tokens: Tokens | null) => {
  session.setState({ tokens, user: tokens ? getUserFromIdToken(tokens?.idToken) : null })
}

export const reloadTokens = async () => {
  try {
    const hash = await auth0.getTokenSilently({ detailedResponse: true, cacheMode: 'off' })

    const tokens = HashToTokens({ ...hash })

    if (tokens) {
      setTokens(tokens)
      setLocalValue(ARTELI_SESSION_KEY, VERSION, tokens)
      // console.log('🌍 Reloaded tokens from session')
    }
  } catch (err) {
    if ((err as GenericError).error !== 'login_required') {
      // console.error(err, 'Failed to reload tokens from session')
    }

    await login()
  }
}

window.onstorage = (event: StorageEvent) => {
  if (event.key !== ARTELI_SESSION_KEY) return

  const newTokens = getFromLocalStorage()

  // console.log(`⬆️ Tokens ${newTokens ? 'updated' : 'removed'} based of localStorage`)

  setTokens(newTokens)
}

export const getExpirationFromToken = (idToken: string) => {
  try {
    const payload = parseJWTToken<{ exp: number }>(idToken)

    return payload!.exp
  } catch (err) {
    console.error(err, 'Failed to parse expiration from token')

    return null
  }
}

export const getUserFromIdToken = (idToken: string): User | null => {
  try {
    const payload = parseJWTToken<{ sub: string; email: string }>(idToken)

    return { sub: payload!.sub, email: payload!.email }
  } catch (error) {
    console.error(error, 'Failed to parse user from token')

    return null
  }
}

const init = () => {
  const localTokens = getFromLocalStorage()

  if (localTokens) {
    // console.info('⬆️ Loaded tokens from local storage')
    setTokens(localTokens)
  }
}

tab.subscribe((key, visible) => {
  if (key !== 'visible') return

  if (visible) {
    // console.debug('👁️ Tab is visible, reloading tokens')
    init()
  } else {
    // console.debug('👁️ Tab is hidden, clearing timeout')
    clearTimeout(timeout)
  }
})

init()
