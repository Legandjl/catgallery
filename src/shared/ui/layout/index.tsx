import { Outlet, NavLink } from 'react-router-dom'
import styles from './layout.module.scss'
import type { ReactElement } from 'react'
import logo from '../../../assets/images/logo.svg'

const Layout = (): ReactElement => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <img src={logo} alt="Cat Gallery Logo" />
          <nav className={styles.links}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favourites"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Favourites
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Explore
            </NavLink>

            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Upload
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
