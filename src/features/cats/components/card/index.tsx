import { type ReactElement } from 'react'
import { useState } from 'react'
import styles from './imageCard.module.scss'
import heart from '../../../../assets/images/heart.svg'
import arrowUp from '../../../../assets/images/arrowUp.svg'
import arrowDown from '../../../../assets/images/arrowDown.svg'
import { useToggleFavourite } from '../../hooks/useToggleFavourite'
import { useLocalVote } from '../../hooks/useLocalVote.ts'

type Props = {
  url: string
  id: string
}

const Card = ({ url, id }: Props): ReactElement => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const { toggleFavourite, isFavourite, isPending } = useToggleFavourite()
  const { handleVoteUp, handleVoteDown, effectiveScore, effectiveVote } = useLocalVote(id)

  const favourite = isFavourite(id)

  return (
    <figure className={styles.polaroid}>
      <div className={styles.media}>
        <div className={styles.imageSkeleton} aria-hidden="true" />
        <img
          className={`${styles.img} ${imgLoaded ? styles.imgLoaded : ''}`}
          src={url}
          alt={`Cat image ${id}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
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
            data-testid={`vote-up-${id}`}
            type="button"
            onClick={handleVoteUp}
            aria-label="Vote up"
            className={`${styles.voteButton} ${effectiveVote === 1 ? styles.voteUpActive : ''}`}
          >
            <img src={arrowUp} alt="" />
          </button>

          <p data-testid={`vote-score-${id}`} className={styles.score}>
            {effectiveScore}
          </p>

          <button
            data-testid={`vote-down-${id}`}
            type="button"
            onClick={handleVoteDown}
            aria-label="Vote down"
            className={`${styles.voteButton} ${effectiveVote === -1 ? styles.voteDownActive : ''}`}
          >
            <img src={arrowDown} alt="" />
          </button>
        </div>
      </figcaption>
    </figure>
  )
}

export default Card
