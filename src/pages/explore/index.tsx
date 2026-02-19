import type { ReactElement } from 'react'
import gallery from '../../shared/ui/gallery/gallery.module.scss'
import { useExploreCats } from '../../features/cats/hooks/useExploreCats.ts'
import ImageCard from '../../features/cats/components/card'
import ImageCardSkeleton from '../../features/cats/components/card/skeleton'
import PawSpinner from '../../shared/ui/spinner'
import { useInfiniteScroll } from '../../shared/hooks/useInfiniteScroll'

const Explore = (): ReactElement => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useExploreCats()

  const cats = data?.pages.flat() ?? []

  const { sentinelRef } = useInfiniteScroll({
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onLoadMore: fetchNextPage,
    rootMargin: '1400px 0px',
  })

  if (isLoading) {
    return (
      <div className={gallery.wrapper}>
        <div className={gallery.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) return <div className={gallery.wrapper}>{(error as Error).message}</div>

  return (
    <div className={gallery.wrapper}>
      <div className={gallery.grid}>
        {cats.map((cat) => (
          <ImageCard key={cat.id} id={cat.id} url={cat.url} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <div style={{ marginBottom: 10 }}>
          <PawSpinner label="Loading more cats" />
        </div>
      )}

      {!hasNextPage && <div>That’s enough cats for one lifetime.</div>}
    </div>
  )
}

export default Explore
