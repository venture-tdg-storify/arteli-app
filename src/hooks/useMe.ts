import { useSession } from './useSession'

export const useMe = () => {
  const { me } = useSession()

  return me
}
