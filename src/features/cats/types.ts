export type CatImage = {
  id: string
  url: string
  width: number
  height: number
}

export type Vote = {
  id: number
  image_id: string
  value: 0 | 1
}

export type UploadResponse = {
  id: string
  url: string
}

export type ExploreParams = {
  limit: number
  page: number
}

export type Favourite = {
  id: number
  image_id: string
  sub_id?: string
  created_at?: string
  image?: { id: string; url: string }
}

export type CreateFavouriteBody = {
  image_id: string
  sub_id?: string
}
