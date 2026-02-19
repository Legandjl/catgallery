import type { ReactElement } from 'react'
import gallery from '../../shared/ui/gallery/gallery.module.scss'
import ImageCard from '../../features/cats/components/card'
import ImageCardSkeleton from '../../features/cats/components/card/skeleton'
import { useFavourites } from '../../features/cats/hooks/useFavourites'

const Favourites = (): ReactElement => {
  const { data, isLoading, isError, error } = useFavourites()
  const Header = (
    <div style={{ padding: '1rem 0', justifySelf: 'center' }}>
      <h2 style={{ margin: 0 }}>Favourites</h2>
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

  if (isError) return <div className={gallery.wrapper}>{(error as Error).message}</div>

  if (!data?.length) return <div className={gallery.wrapper}>No favourites yet.</div>

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
