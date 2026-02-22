import { describe, it, expect } from 'vitest'
import { decideVoteAction, type ExistingVote } from './voteDecision'

describe('decideVoteAction', () => {
  it('noop when desired=0 and no existing vote', () => {
    expect(decideVoteAction(null, 0)).toEqual({ kind: 'noop' })
  })

  it('delete when desired=0 and existing vote', () => {
    const existing: ExistingVote = { id: 123, value: 1 }
    expect(decideVoteAction(existing, 0)).toEqual({ kind: 'delete', id: 123 })
  })

  it('create when desired=1 and no existing vote', () => {
    expect(decideVoteAction(null, 1)).toEqual({ kind: 'create', value: 1 })
  })

  it('create when desired=-1 and no existing vote', () => {
    expect(decideVoteAction(null, -1)).toEqual({ kind: 'create', value: -1 })
  })

  it('delete when desired matches existing (toggle off)', () => {
    const existing: ExistingVote = { id: 5, value: -1 }
    expect(decideVoteAction(existing, -1)).toEqual({ kind: 'delete', id: 5 })
  })

  it('flip when desired changes from existing', () => {
    const existing: ExistingVote = { id: 9, value: 1 }
    expect(decideVoteAction(existing, -1)).toEqual({ kind: 'flip', id: 9, value: -1 })
  })
})
