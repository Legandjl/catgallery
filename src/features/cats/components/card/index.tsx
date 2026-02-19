import type { ReactElement } from 'react'
import { useState } from 'react'
import styles from './imageCard.module.scss'
import heart from '../../../../assets/images/heart.svg'
import { useToggleFavourite } from '../../hooks/useToggleFavourite'

type Props = {
  url: string
  id: string
}

const Card = ({ url, id }: Props): ReactElement => {
  const [loaded, setLoaded] = useState(false)
  const { toggle, isFavourited, isPending } = useToggleFavourite()

  const favourited = isFavourited(id)

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
        <button
          type="button"
          onClick={() => toggle(id)}
          disabled={isPending}
          aria-label={favourited ? 'Unfavourite' : 'Favourite'}
          aria-pressed={favourited}
          className={`${styles.favButton} ${favourited ? styles.favActive : ''}`}
        >
          <img className={styles.heartIcon} src={heart} alt="" />
        </button>
      </figcaption>
    </figure>
  )
}

export default Card
