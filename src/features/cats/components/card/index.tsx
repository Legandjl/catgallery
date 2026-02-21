import { type ReactElement, useEffect, useRef } from 'react'
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
  const { getScoreForImage, getUserVoteValue, commitVote, isBusy } = useHandleVote()
  const [localVote, setLocalVote] = useState<-1 | 0 | 1 | null>(null)
  const serverVote = getUserVoteValue(id)
  const serverScore = getScoreForImage(id)

  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const effectiveVote = localVote ?? serverVote

  const effectiveScore = serverScore + (effectiveVote - serverVote)

  const favourite = isFavourite(id)

  const handleVoteUp = () => {
    const nextVote: -1 | 0 | 1 = effectiveVote === 1 ? 0 : 1
    setLocalVote(nextVote)
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = window.setTimeout(() => {
      commitVote(id, nextVote)
      setLocalVote(null)
    }, 1000)
  }

  const handleVoteDown = () => {
    const nextVote: -1 | 0 | 1 = effectiveVote === -1 ? 0 : -1
    setLocalVote(nextVote)
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = window.setTimeout(() => {
      commitVote(id, nextVote)
      setLocalVote(null)
    }, 1000)
  }

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
            className={`${styles.voteButton} ${effectiveVote === 1 ? styles.voteUpActive : ''}`}
          >
            <img src={arrowUp} alt="" />
          </button>
          <p>{effectiveScore}</p>
          <button
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
