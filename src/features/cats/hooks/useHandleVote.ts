import { useMutation, useQueryClient } from '@tanstack/react-query'
import { catApi } from '../api/catApi.ts'
import { useVotes } from './useVotes.ts'
import { SUB_ID } from '../../../shared/api/request.ts'

type VoteVariables = {
  imageId: string
  value: 1 | -1
}

export const useHandleVote = () => {
  const queryClient = useQueryClient()
  const { data: votes = [] } = useVotes()
  console.log(votes)

  const getVoteIdForDel = (imageId: string): number | null => {
    const vote = votes.find((vote) => vote.sub_id === SUB_ID && vote.image_id === imageId)
    return vote ? vote.id : null
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

  const {
    mutate: vote,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ imageId, value }: VoteVariables) => catApi.vote(imageId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cats', 'votes'] })
    },
  })

  const {
    mutate: deleteVote,
    isPending: deletePending,
    error: deleteError,
  } = useMutation({
    mutationFn: (voteId: number) => catApi.deleteVote(voteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cats', 'votes'] })
    },
  })

  const postVote = (imageId: string, value: 1 | -1) => {
    const alreadyVoted = votes.find((vote) => vote.sub_id === SUB_ID && vote.image_id === imageId)
    console.log(votes)
    if (alreadyVoted) {
      console.log('already voted')
      delVote(imageId)
    } else {
      console.log('voting')
      vote({ imageId, value })
    }
  }

  const delVote = (imageId: string) => {
    const voteId = getVoteIdForDel(imageId)
    if (voteId) {
      deleteVote(voteId)
    }
  }

  return { upvote: postVote, isPending, error, getScoreForImage }
}
