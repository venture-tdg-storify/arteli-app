import type { Me } from '$/api/system'
import type { Tokens, User } from '@/store/auth'
import { useContext, createContext } from 'react'

interface ISessionContext {
  user?: User | null
  tokens?: Tokens
  me: Me
}

export const SessionContext = createContext<ISessionContext>({} as ISessionContext)

export const useSession = () => {
  const session = useContext(SessionContext)

  return session
}
