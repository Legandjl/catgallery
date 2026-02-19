import { useEffect, useRef } from 'react'

type Options = {
  enabled: boolean
  onLoadMore: () => void
  rootMargin?: string
}

export const useInfiniteScroll = ({ enabled, onLoadMore, rootMargin = '1200px 0px' }: Options) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        onLoadMore()
      },
      { root: null, rootMargin, threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, onLoadMore, rootMargin])

  return { sentinelRef }
}
