export type CatImage = {
  id: string
  url: string
  width: number
  height: number
}

export type Favourite = {
  id: number
  image_id: string
}

export type Vote = {
  id: number
  image_id: string
  value: 0 | 1
}
