import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalVote } from './useLocalVote'

const commitVoteMock = vi.fn()

vi.mock('./useHandleVote.ts', () => ({
  useHandleVote: () => ({
    getScoreForImage: (id: string) => (id === 'img-1' ? 7 : 0),
    getUserVoteValue: (id: string) => (id === 'img-1' ? 1 : 0),
    commitVote: commitVoteMock,
  }),
}))

describe('useLocalVote', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    commitVoteMock.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses server state initially', () => {
    const { result } = renderHook(() => useLocalVote('img-1'))

    expect(result.current.effectiveVote).toBe(1)
    expect(result.current.effectiveScore).toBe(7)
  })

  it('updates effectiveVote/effectiveScore immediately on click', () => {
    const { result } = renderHook(() => useLocalVote('img-1'))

    act(() => result.current.handleVoteDown())
    expect(result.current.effectiveVote).toBe(-1)
    expect(result.current.effectiveScore).toBe(5) // 7 + (-1 - 1) = 5
  })

  it('debounces commit: only last click is committed', () => {
    const { result } = renderHook(() => useLocalVote('img-1'))

    act(() => result.current.handleVoteDown()) // desired -1
    act(() => result.current.handleVoteUp()) // desired 0 (because effectiveVote now -1 -> up sets 1? wait, your logic: up toggles 1/0. from -1, up sets 1)
    act(() => result.current.handleVoteDown()) // desired -1 again

    expect(commitVoteMock).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(commitVoteMock).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(commitVoteMock).toHaveBeenCalledTimes(1)
    expect(commitVoteMock).toHaveBeenCalledWith('img-1', -1)
  })

  it('does not commit after unmount', () => {
    const { result, unmount } = renderHook(() => useLocalVote('img-1'))

    act(() => result.current.handleVoteDown())
    unmount()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(commitVoteMock).not.toHaveBeenCalled()
  })
})
