import type { ReactElement } from 'react'
import { Link, Navigate } from 'react-router-dom'
import gallery from '../../shared/ui/gallery/gallery.module.scss'
import ImageCard from '../../features/cats/components/card'
import ImageCardSkeleton from '../../features/cats/components/card/skeleton'
import { useFavourites } from '../../features/cats/hooks/useFavourites'

const Favourites = (): ReactElement => {
  const { data, isLoading, isError } = useFavourites()
  const Header = (
    <div style={{ padding: '1rem 0', justifySelf: 'center' }}>
      <h3 style={{ margin: 0 }}>Favourites</h3>
    </div>
  )

  if (isLoading) {
    return (
      <div className={gallery.wrapper}>
        {Header}
        <div className={gallery.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) return <Navigate to="/oops" replace />

  if (!data?.length)
    return (
      <div className={gallery.wrapper}>
        <div
          className={gallery.empty}
          style={{ padding: '1rem 0', justifySelf: 'center', alignSelf: 'center' }}
        >
          <p style={{ marginTop: 8 }}>
            No favourites yet. <Link to="/explore">Explore cats</Link> or{' '}
            <Link to="/upload">Upload your own</Link> to start a collection.
          </p>
        </div>
      </div>
    )

  return (
    <div className={gallery.wrapper}>
      {Header}
      <div className={gallery.grid}>
        {data
          .filter((fav) => fav.image?.url)
          .map((fav) => (
            <ImageCard key={fav.id} id={fav.image_id} url={fav.image!.url} />
          ))}
      </div>
    </div>
  )
}

export default Favourites
