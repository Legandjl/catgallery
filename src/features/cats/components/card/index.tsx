import type { ReactElement } from 'react'
import { useState } from 'react'
import styles from './imageCard.module.scss'
import heart from '../../../../assets/images/heart.svg'

type Props = {
  url: string
  id: string
}

const Card = ({ url, id }: Props): ReactElement => {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure className={styles.polaroid}>
      <div className={styles.media}>
        <div className={styles.imageSkeleton} aria-hidden="true" />
        <img
          className={`${styles.img} ${loaded ? styles.imgLoaded : ''}`}
          src={url}
          alt={`Cat image ${id}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <figcaption className={styles.caption}>
        <button className={styles.favButton} type="button" aria-label="Favourite">
          <img className={styles.heartIcon} src={heart} alt="" />
        </button>
      </figcaption>
    </figure>
  )
}

export default Card
