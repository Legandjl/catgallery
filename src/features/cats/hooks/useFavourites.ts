import { useQuery } from '@tanstack/react-query'
import { catApi } from '../api/catApi'

export const useFavourites = () => {
  return useQuery({
    queryKey: ['cats', 'favourites'],
    queryFn: catApi.getFavourites,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
