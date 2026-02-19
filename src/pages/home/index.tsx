import type { ReactElement } from 'react'
import { useMyImages } from '../../features/cats/hooks/useMyImages.ts'

const Home = (): ReactElement => {
  const { data, isLoading, isError, error } = useMyImages()

  if (isLoading) return <div>Loading…</div>

  if (isError) return <div>{(error as Error).message}</div>

  if (!data?.length) return <div>No cats uploaded yet.</div>

  return (
    <div>
      <h2>My Cats</h2>
      <div
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        }}
      >
        {data.map((cat) => (
          <img
            key={cat.id}
            src={cat.url}
            alt={`Uploaded cat ${cat.id}`}
            style={{ width: '100%', borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
