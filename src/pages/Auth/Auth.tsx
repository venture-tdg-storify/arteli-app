import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '@/components/Loader'
import { getReturnToUrl, auth0 } from '@/store/auth'
import analytics from '@/utils/analytics'

export function Auth() {
  const navigate = useNavigate()

  useEffect(() => {
    const login = async () => {
      let returnToUrl: string | undefined

      try {
        returnToUrl = await getReturnToUrl()
      } finally {
        const user = await auth0.getUser()

        if (user?.sub) {
          analytics?.track('User Logged In', { id: user.sub })
        }

        navigate(returnToUrl || '/', { replace: true })
      }
    }

    login()
  }, [navigate])

  return <Loader />
}
