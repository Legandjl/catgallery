import { type ReactElement } from 'react'

const NotFound = (): ReactElement => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>404</h1>
      <p>That page does not exist.</p>
    </div>
  )
}

export default NotFound
