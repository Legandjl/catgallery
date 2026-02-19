import { Outlet, Link } from 'react-router-dom'
import styles from './layout.module.scss'
import type { ReactElement } from 'react'
import logo from '../../../assets/images/logo.svg'

const Layout = (): ReactElement => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <img src={logo} />
          <div className={styles.links}>
            <Link to="/">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/upload">Upload</Link>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
