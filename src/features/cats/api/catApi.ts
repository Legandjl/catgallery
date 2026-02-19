import type { CatImage, ExploreParams, UploadResponse } from '../types'
import { request } from '../../../shared/api/request'

export const catApi = {
  explore: ({ limit, page }: ExploreParams) =>
    request<CatImage[]>(`/images/search?limit=${limit}&page=${page}`),

  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return request<UploadResponse>(`/images/upload`, {
      method: 'POST',
      body: formData,
    })
  },

  myImages: (limit = 50) => request<CatImage[]>(`/images?limit=${limit}`),
}
