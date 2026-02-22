import type { CatImage, ExploreParams, UploadResponse, Favourite, Vote } from '../types'
import { jsonRequestInit, request, SUB_ID } from '../../../shared/api/request'

export const catApi = {
  explore: ({ limit, page }: ExploreParams) =>
    request<CatImage[]>(`/images/search?limit=${limit}&page=${page}`),

  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sub_id', SUB_ID)

    return request<UploadResponse>(`/images/upload`, {
      method: 'POST',
      body: formData,
    })
  },

  myImages: (limit = 50) =>
    request<CatImage[]>(`/images?limit=${limit}&order=DESC&sub_id=${encodeURIComponent(SUB_ID)}`),

  getFavourites: () =>
    request<Favourite[]>(
      `/favourites?sub_id=${encodeURIComponent(SUB_ID)}&include_image=1&order=DESC`,
    ),

  favourite: (imageId: string) =>
    request<{ id: number; message: string }>(
      `/favourites`,
      jsonRequestInit({ image_id: imageId, sub_id: SUB_ID }, { method: 'POST' }),
    ),

  unfavourite: (favouriteId: number) =>
    request<void>(`/favourites/${favouriteId}`, { method: 'DELETE' }),

  getVotes: () => request<Vote[]>(`/votes?&order=DESC`),

  vote: (imageId: string, value: 1 | -1) =>
    request<Vote>(
      `/votes`,
      jsonRequestInit({ image_id: imageId, sub_id: SUB_ID, value }, { method: 'POST' }),
    ),

  deleteVote: (voteId: number) => request<void>(`/votes/${voteId}`, { method: 'DELETE' }),
}
