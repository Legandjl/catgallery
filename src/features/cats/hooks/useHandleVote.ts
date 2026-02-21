import { useMutation, useQueryClient } from '@tanstack/react-query'
import { catApi } from '../api/catApi.ts'
import { useVotes } from './useVotes.ts'
import { SUB_ID } from '../../../shared/api/request.ts'
import type { Vote } from '../types.ts'

type VoteVariables = {
  imageId: string
  value: 1 | -1
}

type FlipVariables = { existingVoteId: number; imageId: string; nextValue: 1 | -1 }

type OptimisticContext = {
  previousVotes: Vote[]
  optimisticVoteId: number
  imageId: string
}

const VOTES_QUERY_KEY = ['cats', 'votes'] as const

export const useHandleVote = () => {
  const queryClient = useQueryClient()
  const { data: votes = [] } = useVotes()

  // Read helpers

  const getUserVoteValue = (imageId: string): -1 | 0 | 1 => {
    const vote = votes.find((vote) => vote.sub_id === SUB_ID && vote.image_id === imageId)
    return vote ? (vote.value as -1 | 1) : 0
  }

  const getScoreForImage = (imageId: string) => {
    let score = 0
    for (const vote of votes) {
      if (vote.image_id === imageId) {
        score += vote.value
      }
    }
    return score
  }

  const isOptimisticId = (id: number) => id < 0
  const isServerId = (id: number) => id > 0

  const isNotFoundDelete = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    return msg.includes('NO_VOTE_FOUND_MATCHING_ID') || msg.includes('404')
  }

  // Cache operations

  const addOptimisticVote = (vote: VoteVariables) => {
    const optimisticVote: Vote = {
      id: -Date.now(),
      image_id: vote.imageId,
      value: vote.value,
      sub_id: SUB_ID,
    } as Vote

    queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) => {
      const alreadyExists = current.some((v) => v.image_id === vote.imageId && v.sub_id === SUB_ID)
      if (alreadyExists) return current
      return [optimisticVote, ...current]
    })

    return optimisticVote.id
  }

  const replaceOptimisticVoteWithReal = (optimisticId: number, realId: number, imageId: string) => {
    queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) => {
      return current.map((vote) => {
        if (vote.id !== optimisticId) return vote
        return { ...vote, id: realId, image_id: imageId } as Vote
      })
    })
  }

  const removeVote = (voteId: number) => {
    queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) => {
      return current.filter((vote) => vote.id !== voteId)
    })
  }

  const replaceVoteId = (oldId: number, newId: number) => {
    queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) => {
      return current.map((vote) => {
        if (vote.id !== oldId) return vote
        return { ...vote, id: newId } as Vote
      })
    })
  }

  // Flip mutation - when user switches from up to down or down to up (API requires delete then create)
  const {
    mutate: flipVote,
    isPending: flipPending,
    error: flipError,
  } = useMutation<Vote, Error, FlipVariables, { previousVotes: Vote[]; existingVoteId: number }>({
    mutationFn: async ({ existingVoteId, imageId, nextValue }) => {
      if (isServerId(existingVoteId)) {
        try {
          await catApi.deleteVote(existingVoteId)
        } catch (err) {
          if (!isNotFoundDelete(err)) throw err
        }
      }

      return catApi.vote(imageId, nextValue)
    },

    onMutate: async ({ existingVoteId, nextValue }) => {
      await queryClient.cancelQueries({ queryKey: VOTES_QUERY_KEY })
      const previousVotes = queryClient.getQueryData<Vote[]>(VOTES_QUERY_KEY) ?? []

      queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) => {
        return current.map((v) => {
          if (v.id !== existingVoteId) return v
          return { ...v, value: nextValue }
        })
      })

      return { previousVotes, existingVoteId }
    },

    onError: (_err, _vars, context) => {
      if (!context) return
      queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, context.previousVotes)
    },

    onSuccess: (response, _vars, context) => {
      if (!context) return
      replaceVoteId(context.existingVoteId, response.id)
      queryClient.invalidateQueries({ queryKey: VOTES_QUERY_KEY })
    },
  })

  // Delete mutation - removes the user's vote for an image
  const {
    mutate: deleteVote,
    isPending: deletePending,
    error: deleteError,
  } = useMutation({
    mutationFn: async (voteId: number) => {
      if (isOptimisticId(voteId)) return

      try {
        await catApi.deleteVote(voteId)
      } catch (err) {
        if (!isNotFoundDelete(err)) throw err
      }
    },

    onMutate: async (voteId: number) => {
      await queryClient.cancelQueries({ queryKey: VOTES_QUERY_KEY })
      const previousVotes = queryClient.getQueryData<Vote[]>(VOTES_QUERY_KEY) ?? []
      removeVote(voteId)
      return { previousVotes }
    },

    onError: (_error, _voteId, context) => {
      if (!context) return
      queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, context.previousVotes)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOTES_QUERY_KEY })
    },
  })

  // Vote mutation - creates a brand new vote (when the user hasn't voted on that image yet)
  const {
    mutate: vote,
    isPending,
    error,
  } = useMutation<Vote, Error, VoteVariables, OptimisticContext>({
    mutationFn: ({ imageId, value }) => catApi.vote(imageId, value),

    onMutate: async ({ imageId, value }): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: VOTES_QUERY_KEY })
      const previousVotes = queryClient.getQueryData<Vote[]>(VOTES_QUERY_KEY) ?? []

      const optimisticVoteId = addOptimisticVote({ imageId, value })

      return { previousVotes, optimisticVoteId, imageId }
    },

    onSuccess: (response, _variables, context) => {
      if (!context) return
      replaceOptimisticVoteWithReal(context.optimisticVoteId, response.id, context.imageId)
      queryClient.invalidateQueries({ queryKey: VOTES_QUERY_KEY })
    },
  })

  //Translates the user’s final intended vote state into the appropriate server mutation.

  const commitVote = (imageId: string, desired: -1 | 0 | 1) => {
    const existing = (queryClient.getQueryData<Vote[]>(VOTES_QUERY_KEY) ?? []).find(
      (vote) => vote.sub_id === SUB_ID && vote.image_id === imageId,
    )
    if (desired === 0) {
      if (existing) {
        deleteVote(existing.id)
      }
      return
    }

    // No existing vote (create)
    if (!existing) {
      vote({ imageId, value: desired as 1 | -1 })
      return
    }

    // Clicking the same vote again (toggle off)
    if (existing.value === desired) {
      deleteVote(existing.id)
      return
    }

    // Switching from upvote to downvote (flip)
    flipVote({
      existingVoteId: existing.id,
      imageId,
      nextValue: desired,
    })
  }

  const isBusy = isPending || deletePending || flipPending
  const combinedError = error ?? deleteError ?? flipError

  return { isBusy, combinedError, getScoreForImage, getUserVoteValue, commitVote }
}
