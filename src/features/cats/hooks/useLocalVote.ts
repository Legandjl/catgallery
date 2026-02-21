import { useHandleVote } from './useHandleVote.ts'
import { useEffect, useRef, useState } from 'react'

export const useLocalVote = (id: string) => {
  const { getScoreForImage, getUserVoteValue, commitVote } = useHandleVote()
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

  return { handleVoteUp, handleVoteDown, effectiveScore, effectiveVote }
}
