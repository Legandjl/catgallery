import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { catApi } from '../api/catApi'
import type { Favourite } from '../types'
import { useFavourites } from './useFavourites'

const FAVOURITES_QUERY_KEY = ['cats', 'favourites'] as const

type OptimisticContext = {
  previousFavourites: Favourite[]
  optimisticFavouriteId: number
  imageId: string
}

export const useToggleFavourite = () => {
  const queryClient = useQueryClient()
  const { data: favourites = [] } = useFavourites()

  const favouritesByImageId = useMemo(() => {
    return new Map(favourites.map((fav) => [fav.image_id, fav] as const))
  }, [favourites])

  const addOptimisticFavouriteToCache = (imageId: string) => {
    const optimisticFavourite: Favourite = {
      id: -Date.now(),
      image_id: imageId,
    } as Favourite
    queryClient.setQueryData<Favourite[]>(FAVOURITES_QUERY_KEY, (current = []) => {
      const alreadyExists = current.some((fav) => fav.image_id === imageId)
      if (alreadyExists) return current
      return [optimisticFavourite, ...current]
    })
    return optimisticFavourite.id
  }

  const replaceOptimisticIdWithRealId = (optimisticId: number, realId: number, imageId: string) => {
    queryClient.setQueryData<Favourite[]>(FAVOURITES_QUERY_KEY, (current = []) =>
      current.map((fav) =>
        fav.id === optimisticId ? ({ ...fav, id: realId, image_id: imageId } as Favourite) : fav,
      ),
    )
  }

  const removeFavouriteFromCacheById = (favouriteId: number) => {
    queryClient.setQueryData<Favourite[]>(FAVOURITES_QUERY_KEY, (current = []) =>
      current.filter((fav) => fav.id !== favouriteId),
    )
  }

  const favouriteMutation = useMutation({
    mutationFn: (imageId: string) => catApi.favourite(imageId),

    onMutate: async (imageId): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: FAVOURITES_QUERY_KEY })

      const previousFavourites = queryClient.getQueryData<Favourite[]>(FAVOURITES_QUERY_KEY) ?? []
      const optimisticFavouriteId = addOptimisticFavouriteToCache(imageId)
      return { previousFavourites, optimisticFavouriteId, imageId }
    },

    onError: (_error, _imageId, context) => {
      if (!context) return
      queryClient.setQueryData<Favourite[]>(FAVOURITES_QUERY_KEY, context.previousFavourites)
    },
    onSuccess: (response, imageId, context) => {
      if (!context) return
      replaceOptimisticIdWithRealId(context.optimisticFavouriteId, response.id, imageId)
      queryClient.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY })
    },
  })

  const unfavouriteMutation = useMutation({
    mutationFn: (favouriteId: number) => catApi.unfavourite(favouriteId),

    onMutate: async (favouriteId) => {
      await queryClient.cancelQueries({ queryKey: FAVOURITES_QUERY_KEY })

      const previousFavourites = queryClient.getQueryData<Favourite[]>(FAVOURITES_QUERY_KEY) ?? []

      removeFavouriteFromCacheById(favouriteId)

      return { previousFavourites }
    },

    onError: (_error, _favouriteId, context) => {
      if (!context) return
      queryClient.setQueryData<Favourite[]>(FAVOURITES_QUERY_KEY, context.previousFavourites)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEY })
    },
  })

  const isFavourited = (imageId: string) => favouritesByImageId.has(imageId)

  const toggleFavourite = (imageId: string) => {
    const existingFavourite = favouritesByImageId.get(imageId)
    if (existingFavourite) unfavouriteMutation.mutate(existingFavourite.id)
    else favouriteMutation.mutate(imageId)
  }

  const isPending = favouriteMutation.isPending || unfavouriteMutation.isPending

  return { toggle: toggleFavourite, isFavourited, isPending }
}
