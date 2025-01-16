import type { ReactNode } from 'react'
import React, { useEffect, useMemo } from 'react'
import Button from '@mui/material/Button'
import { FormattedMessage, defineMessages } from 'react-intl'
import api from '$/api'
import { UserRoles, type TenantUser } from '$/api/system'
import ErrorMessage from '@/components/ErrorMessage'
import Loader from '@/components/Loader'
import { SessionContext } from '@/hooks/useSession'
import { useSettings } from '@/hooks/useSettings'
import analytics from '@/utils/analytics'
import { session, reloadTokens, logout } from './auth'
import { tab } from './tab'

const useMeQuery = api.Me.getMe.asQuery()

const messages = defineMessages({
  signOut: { defaultMessage: 'Sign out', id: 'xXbJso' },
  canNotLoadUserInfo: { defaultMessage: 'Can not load customer info', id: '+XCoYs' },
  noOrganization: {
    defaultMessage: 'This account is not associated with an organization',
    id: 'Zmp0Rg'
  },
  noCategoryOrStores: {
    defaultMessage: 'You have no category or stores assigned, please contact your administrator',
    id: 'gQFReu'
  },
  canNotGetCurrentTenantUser: {
    defaultMessage: 'Can not get current company customer info',
    id: 'Dp43Ds'
  }
})

const ErrorInfo: React.FC<{ children: ReactNode }> = ({ children }) => {
  const logoutWithRedirect = () => logout({ returnTo: window.location.origin })

  return (
    <ErrorMessage
      action={
        <Button onClick={logoutWithRedirect} sx={{ mt: 2, alignSelf: 'center' }}>
          <FormattedMessage {...messages.signOut} />
        </Button>
      }
    >
      {children}
    </ErrorMessage>
  )
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { tokens, user } = session.use()
  const { data: me, isLoading: isLoadingMe } = useMeQuery({ enabled: !!tokens })
  const { tenantUserId, setTenantUserId } = useSettings()
  const { visible } = tab.use()
  const isIdpApp = location.pathname.includes('/idp')
  const isMainApp = !isIdpApp

  const tenantUsers = me?.tenantUsers

  const tenantUser = useMemo<TenantUser | null>(
    () => me?.tenantUsers.find((tu) => tu.id === tenantUserId) ?? null,
    [me, tenantUserId]
  )

  useEffect(() => {
    if (tokens || !visible) {
      return
    }

    // console.debug('No tokens, reloading from Session component')

    reloadTokens()
  }, [tokens, visible])

  useEffect(() => {
    if (user) {
      analytics?.identify({ id: user.sub, email: user.email })
    }
  }, [user])

  useEffect(() => {
    if (tenantUserId || !tenantUsers?.length) return

    setTenantUserId(tenantUsers[0]?.id)
  }, [me, setTenantUserId, tenantUserId, tenantUsers])

  if (!tokens || isLoadingMe || (!tenantUserId && tenantUsers?.length)) {
    return <Loader />
  }

  if (!me) {
    return (
      <ErrorInfo>
        <FormattedMessage {...messages.canNotLoadUserInfo} />
      </ErrorInfo>
    )
  }

  const isStaff = me.user.roles & UserRoles.Staff

  if (isIdpApp) {
    if (!isStaff) {
      location.replace('/') // redirect to App
    }
  }

  if (isMainApp) {
    if (!tenantUsers?.length) {
      if (isStaff) {
        location.replace('/idp') // redirect to IDP
      }

      return (
        <ErrorInfo>
          <FormattedMessage {...messages.noOrganization} />
        </ErrorInfo>
      )
    }

    if (!tenantUser) {
      return (
        <ErrorInfo>
          <FormattedMessage {...messages.canNotGetCurrentTenantUser} />
        </ErrorInfo>
      )
    }

    if (!tenantUser.categoryExternalIds?.length || !tenantUser.storeExternalIds?.length) {
      return (
        <ErrorInfo>
          <FormattedMessage {...messages.noCategoryOrStores} />
        </ErrorInfo>
      )
    }
  }

  return <SessionContext.Provider value={{ user, tokens, me }}>{children}</SessionContext.Provider>
}
