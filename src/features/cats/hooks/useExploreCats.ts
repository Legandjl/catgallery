import { useInfiniteQuery } from '@tanstack/react-query'
import { catApi } from '../api/catApi'

const LIMIT = 24

export const useExploreCats = () => {
  return useInfiniteQuery({
    queryKey: ['cats', 'explore', 'infinite', LIMIT],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => catApi.explore({ limit: LIMIT, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length,
    gcTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
