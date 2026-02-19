import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollToTop = (scrollRef: React.RefObject<HTMLElement | null>) => {
  const location = useLocation()

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    el.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, scrollRef])
}
