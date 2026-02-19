import type { CatImage } from '../types'
import { request } from '../../../shared/api/request.ts'

export const catApi = {
  explore: (params: { limit: number; page: number }) =>
    request<CatImage[]>(`/images/search?limit=${params.limit}&page=${params.page}`),
}
