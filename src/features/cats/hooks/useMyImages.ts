import { useQuery } from '@tanstack/react-query'
import { catApi } from '../api/catApi'
import type { CatImage } from '../types'

export const useMyImages = () => {
  return useQuery<CatImage[]>({
    queryKey: ['cats', 'my-images'],
    queryFn: () => catApi.myImages(),
    staleTime: 60_000,
  })
}
