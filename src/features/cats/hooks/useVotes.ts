import { useQuery } from '@tanstack/react-query'
import { catApi } from '../api/catApi'

export const useVotes = () => {
  return useQuery({
    queryKey: ['cats', 'votes'],
    queryFn: catApi.getVotes,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
