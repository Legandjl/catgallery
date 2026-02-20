import type { ReactElement } from 'react'
import { useState } from 'react'
import styles from './imageCard.module.scss'
import heart from '../../../../assets/images/heart.svg'
import arrowUp from '../../../../assets/images/arrowUp.svg'
import arrowDown from '../../../../assets/images/arrowDown.svg'
import { useToggleFavourite } from '../../hooks/useToggleFavourite'
import { useHandleVote } from '../../hooks/useHandleVote.ts'

type Props = {
  url: string
  id: string
}

const Card = ({ url, id }: Props): ReactElement => {
  const [loaded, setLoaded] = useState(false)
  const { toggleFavourite, isFavourite, isPending } = useToggleFavourite()
  const { setVote, getScoreForImage, getUserVoteValue } = useHandleVote()

  const favourite = isFavourite(id)

  const handleVoteUp = () => {
    console.log(`User voted UP on image ${id}`)
    setVote(id, 1)
  }

  const handleVoteDown = () => {
    console.log(`User voted DOWN on image ${id}`)
    setVote(id, -1)
  }

  const voteValue = getUserVoteValue(id)

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
          onClick={() => toggleFavourite(id)}
          disabled={isPending}
          aria-label={favourite ? 'Unfavourite' : 'Favourite'}
          aria-pressed={favourite}
          className={`${styles.favButton} ${favourite ? styles.favActive : ''}`}
        >
          <img className={styles.heartIcon} src={heart} alt="" />
        </button>

        <div className={styles.voteButtons}>
          <button
            type="button"
            onClick={handleVoteUp}
            aria-label="Vote up"
            className={`${styles.voteButton} ${voteValue === 1 ? styles.voteUpActive : ''}`}
          >
            <img src={arrowUp} alt="" />
          </button>
          <p>{getScoreForImage(id)}</p>
          <button
            type="button"
            onClick={handleVoteDown}
            aria-label="Vote down"
            className={`${styles.voteButton} ${voteValue === -1 ? styles.voteDownActive : ''}`}
          >
            <img src={arrowDown} alt="" />
          </button>
        </div>
      </figcaption>
    </figure>
  )
}

export default Card
