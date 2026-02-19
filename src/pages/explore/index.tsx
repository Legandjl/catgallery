import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import styles from './explore.module.scss'
import { useExploreInfinite } from '../../features/cats/hooks/useExploreInfinite.ts'
import ImageCard from '../../features/cats/components/card'
import ImageCardSkeleton from '../../features/cats/components/card/skeleton'
import PawSpinner from '../../shared/ui/spinner'

const Explore = (): ReactElement => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useExploreInfinite()

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry.isIntersecting) return
        if (!hasNextPage || isFetchingNextPage) return
        fetchNextPage()
      },
      { root: null, rootMargin: '600px 0px', threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const cats = data?.pages.flat() ?? []

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) return <div className={styles.wrapper}>{(error as Error).message}</div>

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {cats.map((cat) => (
          <ImageCard key={cat.id} id={cat.id} url={cat.url} />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div style={{ margin: '10px' }}>
          <PawSpinner label="Loading more cats" />
        </div>
      )}

      {!hasNextPage && <div className={styles.end}>That’s enough cats for one lifetime.</div>}
    </div>
  )
}

export default Explore
