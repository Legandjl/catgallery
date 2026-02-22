import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import gallery from '../../shared/ui/gallery/gallery.module.scss'
import { useMyCats } from '../../features/cats/hooks/useMyCats'
import ImageCard from '../../features/cats/components/card'
import ImageCardSkeleton from '../../features/cats/components/card/skeleton'

const Home = (): ReactElement => {
  const { data, isLoading, isError, error } = useMyCats()

  const Header = (
    <div style={{ padding: '1rem 0', justifySelf: 'center' }}>
      <h2 style={{ margin: 0 }}>My Uploads</h2>
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

  const cats = data ?? []

  if (!cats.length) {
    return (
      <div className={gallery.wrapper}>
        <div
          className={gallery.empty}
          style={{ padding: '1rem 0', justifySelf: 'center', alignSelf: 'center' }}
        >
          <p style={{ marginTop: 8 }}>
            No cats uploaded yet. <Link to="/upload">Upload a cat</Link> or{' '}
            <Link to="/explore">browse Explore</Link> to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={gallery.wrapper}>
      {Header}
      <div className={gallery.grid}>
        {cats.map((cat) => (
          <ImageCard key={cat.id} id={cat.id} url={cat.url} />
        ))}
      </div>
    </div>
  )
}

export default Home
