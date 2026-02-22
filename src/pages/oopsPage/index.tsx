import { type ReactElement } from 'react'

const OopsPage = (): ReactElement => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Oops something went wrong</h1>
      <p>Please return to the previous page and try again.</p>
    </div>
  )
}

export default OopsPage
