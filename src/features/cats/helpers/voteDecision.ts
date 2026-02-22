export type VoteValue = -1 | 0 | 1

export type ExistingVote = { id: number; value: -1 | 1 } | null

export type Decision =
  | { kind: 'noop' }
  | { kind: 'delete'; id: number }
  | { kind: 'create'; value: -1 | 1 }
  | { kind: 'flip'; id: number; value: -1 | 1 }

export function decideVoteAction(existing: ExistingVote, desired: VoteValue): Decision {
  if (desired === 0) return existing ? { kind: 'delete', id: existing.id } : { kind: 'noop' }
  if (!existing) return { kind: 'create', value: desired }
  if (existing.value === desired) return { kind: 'delete', id: existing.id }
  return { kind: 'flip', id: existing.id, value: desired }
}
