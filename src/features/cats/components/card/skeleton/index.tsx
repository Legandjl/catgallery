import type { ReactElement } from 'react'
import styles from '../imageCard.module.scss'

const ImageCardSkeleton = (): ReactElement => {
  return (
    <figure className={`${styles.polaroid} ${styles.loading}`}>
      <div className={styles.media}>
        <div className={styles.imageSkeleton} aria-hidden="true" />
      </div>
      <figcaption className={styles.caption} />
    </figure>
  )
}

export default ImageCardSkeleton
