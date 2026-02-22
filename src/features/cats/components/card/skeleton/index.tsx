import type { ReactElement } from 'react'
import styles from '../imageCard.module.scss'
import heart from '../../../../../assets/images/heart.svg'
import arrowUp from '../../../../../assets/images/arrowUp.svg'
import arrowDown from '../../../../../assets/images/arrowDown.svg'

const ImageCardSkeleton = (): ReactElement => {
  return (
    <figure className={`${styles.polaroid} ${styles.loading}`}>
      <div className={styles.media}>
        <div className={styles.imageSkeleton} aria-hidden="true" />
      </div>

      <figcaption className={styles.caption}>
        <button type="button" className={`${styles.favButton}`}>
          <img className={`${styles.heartSkeleton} ${styles.heartIcon}`} src={heart} alt="" />
        </button>

        <div className={styles.voteButtons}>
          <button
            type="button"
            aria-label="Vote up"
            className={`${styles.voteButton} ${styles.voteSkeleton}`}
          >
            <img src={arrowUp} alt="" />
          </button>

          <p className={styles.voteCountSkeleton}>{''}</p>

          <button type="button" className={`${styles.voteButton} ${styles.voteSkeleton}`}>
            <img src={arrowDown} alt="" />
          </button>
        </div>
      </figcaption>
    </figure>
  )
}

export default ImageCardSkeleton
