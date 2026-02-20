import { useMutation, useQueryClient } from '@tanstack/react-query'
import { catApi } from '../api/catApi.ts'
import { useVotes } from './useVotes.ts'
import { SUB_ID } from '../../../shared/api/request.ts'
import type { Vote } from '../types.ts'

type VoteVariables = {
  imageId: string
  value: 1 | -1
}
type OptimisticContext = {
  previousVotes: Vote[]
  optimisticVoteId: number
  imageId: string
}

const VOTES_QUERY_KEY = ['cats', 'votes'] as const

export const useHandleVote = () => {
  const queryClient = useQueryClient()
  const { data: votes = [] } = useVotes()

  const getVoteIdForDel = (imageId: string): number | null => {
    const vote = votes.find((vote) => vote.sub_id === SUB_ID && vote.image_id === imageId)
    return vote ? vote.id : null
  }

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

  const addOptimisticVoteToCache = (vote: VoteVariables) => {
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

  const replaceOptimisticVoteWithRealId = (
    optimisticId: number,
    realId: number,
    imageId: string,
  ) => {
    queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) =>
      current.map((vote) =>
        vote.id === optimisticId ? ({ ...vote, id: realId, image_id: imageId } as Vote) : vote,
      ),
    )
  }

  const removeVoteFromCache = (voteId: number) => {
    queryClient.setQueryData<Vote[]>(VOTES_QUERY_KEY, (current = []) =>
      current.filter((vote) => vote.id !== voteId),
    )
  }

  const {
    mutate: vote,
    isPending,
    error,
  } = useMutation<Vote, Error, VoteVariables, OptimisticContext>({
    mutationFn: ({ imageId, value }) => catApi.vote(imageId, value),
    onMutate: async ({ imageId, value }): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: VOTES_QUERY_KEY })
      const previousVotes = queryClient.getQueryData<Vote[]>(VOTES_QUERY_KEY) ?? []
      const optimisticVoteId = addOptimisticVoteToCache({ imageId, value })
      return { previousVotes, optimisticVoteId, imageId }
    },
    onSuccess: (response, _variables, context) => {
      if (!context) return
      replaceOptimisticVoteWithRealId(context.optimisticVoteId, response.id, context.imageId)
      queryClient.invalidateQueries({ queryKey: VOTES_QUERY_KEY })
    },
  })

  const {
    mutate: deleteVote,
    isPending: deletePending,
    error: deleteError,
  } = useMutation({
    mutationFn: (voteId: number) => catApi.deleteVote(voteId),
    onMutate: async (voteId: number) => {
      await queryClient.cancelQueries({ queryKey: VOTES_QUERY_KEY })
      const previousVotes = queryClient.getQueryData<Vote[]>(VOTES_QUERY_KEY) ?? []
      removeVoteFromCache(voteId)
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

  const setVote = (imageId: string, value: 1 | -1) => {
    const alreadyVoted = votes.find((vote) => vote.sub_id === SUB_ID && vote.image_id === imageId)
    if (!alreadyVoted) {
      vote({ imageId, value })
    } else if (alreadyVoted.value === value) {
      deleteVote(alreadyVoted.id)
    } else {
      delVote(imageId)
    }
  }

  const delVote = (imageId: string) => {
    const voteId = getVoteIdForDel(imageId)
    if (voteId !== null) deleteVote(voteId)
  }

  const isBusy = isPending || deletePending
  const combinedError = error ?? deleteError

  return { setVote, isBusy, combinedError, getScoreForImage, getUserVoteValue }
}
