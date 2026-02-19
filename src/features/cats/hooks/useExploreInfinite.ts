import { useInfiniteQuery } from '@tanstack/react-query'
import { catApi } from '../api/catApi'

const LIMIT = 24

export function useExploreInfinite() {
  return useInfiniteQuery({
    queryKey: ['cats', 'explore', 'infinite', LIMIT],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => catApi.explore({ limit: LIMIT, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 0,
  })
}
