import type { ReactElement } from 'react'
import { useRef } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import styles from './layout.module.scss'
import logo from '../../../assets/images/logo.svg'
import { useScrollToTop } from '../../../features/cats/hooks/useScrollToTop'
import { Toaster } from 'react-hot-toast'

const Layout = (): ReactElement => {
  const scrollRef = useRef<HTMLElement | null>(null)

  useScrollToTop(scrollRef)

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <img src={logo} alt="Cat Gallery Logo" className={styles.logo} />
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

      <main ref={scrollRef} className={styles.content}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>Cat Gallery © {new Date().getFullYear()}</p>
          <p>
            Built with React & TheCatAPI ·{' '}
            <a href="https://github.com/Legandjl/catgallery" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default Layout
