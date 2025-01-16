import { useCallback, useState } from 'react'
import { usePresentation } from './usePresentation'

export const usePresentationMenu = () => {
  const { isPresentation } = usePresentation()
  const [showMenu, setShowMenu] = useState(false)

  const handleMouseEnter = useCallback(() => {
    if (isPresentation) setShowMenu(true)
  }, [isPresentation])

  const handleMouseLeave = useCallback(() => {
    if (isPresentation) setShowMenu(false)
  }, [isPresentation])

  return {
    showMenu: isPresentation ? showMenu : false,
    setShowMenu,
    handleMouseEnter,
    handleMouseLeave
  }
}
