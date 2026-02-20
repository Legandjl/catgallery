import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { catApi } from '../api/catApi'

const LIMIT = 24

export const useExploreCats = () => {
  const qc = useQueryClient()

  useEffect(
    () => () => {
      qc.removeQueries({ queryKey: ['cats', 'explore', 'infinite', LIMIT] })
    },
    [qc],
  )

  return useInfiniteQuery({
    queryKey: ['cats', 'explore', 'infinite', LIMIT],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => catApi.explore({ limit: LIMIT, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}
