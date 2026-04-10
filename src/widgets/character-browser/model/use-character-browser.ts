import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { type SubmitEvent, useEffect } from 'react'
import { type SubmitHandler, type UseFormRegisterReturn, useForm, useWatch } from 'react-hook-form'

import { characterCacheStore, useCharacterCacheStore } from '@/entities/character/model/cache-store'
import { isCacheEntryExpired } from '@/entities/character/model/cache-utils'
import type { Character } from '@/entities/character/model/types'
import { useCharacterCachePersistence } from '@/entities/character/model/use-character-cache-persistence'
import {
  type SearchCharacterFormValues,
  searchCharacterSchema,
} from '@/features/search-character/model/search-character-form'
import { useCachedCharacterPreview } from '@/features/search-character/model/use-cached-character-preview'
import { CharacterNotFoundError, fetchCharacter } from '@/shared/api/fetch-character'
import { strings } from '@/shared/i18n/strings'
import {
  type CharacterBrowserScreenState,
  getCharacterBrowserScreenState,
  selectCacheRailCharacterIds,
  selectVisibleCharacter,
} from '@/widgets/character-browser/model/character-browser-view'

interface UseCharacterBrowserResult {
  cacheRailCharacters: Character[]
  characterIdField: UseFormRegisterReturn<'characterId'>
  clearCache: () => void
  errorMessage: string | null
  isLoading: boolean
  removeCharacter: (characterId: number) => void
  screenState: CharacterBrowserScreenState
  selectCharacter: (characterId: number) => void
  submitCharacterSearch: (event: SubmitEvent<HTMLFormElement>) => void
  visibleCharacter: Character | null
  visibleCharacterId: number | null
}

function useCharacterBrowser(): UseCharacterBrowserResult {
  useCharacterCachePersistence()

  const { control, handleSubmit, register, setValue } = useForm<SearchCharacterFormValues>({
    defaultValues: {
      characterId: String(characterCacheStore.getState().visibleCharacterId ?? ''),
    },
    resolver: zodResolver(searchCharacterSchema),
  })
  const cacheById = useCharacterCacheStore((state) => state.cacheById)
  const cacheOrder = useCharacterCacheStore((state) => state.cacheOrder)
  const visibleCharacterId = useCharacterCacheStore((state) => state.visibleCharacterId)
  const errorMessage = useCharacterCacheStore((state) => state.errorMessage)
  const upsertCharacter = useCharacterCacheStore((state) => state.upsertCharacter)
  const clearCache = useCharacterCacheStore((state) => state.clearCache)
  const removeCharacter = useCharacterCacheStore((state) => state.removeCharacter)
  const setVisibleCharacter = useCharacterCacheStore((state) => state.setVisibleCharacter)
  const setError = useCharacterCacheStore((state) => state.setError)
  const clearError = useCharacterCacheStore((state) => state.clearError)
  const watchedCharacterId =
    useWatch({
      control,
      name: 'characterId',
    }) ?? ''

  useCachedCharacterPreview({
    watchedCharacterId,
  })

  // Sync form with store when selection changes (e.g. via cache rail or hydration)
  useEffect(() => {
    setValue('characterId', String(visibleCharacterId ?? ''))
  }, [visibleCharacterId, setValue])

  const visibleCharacter = selectVisibleCharacter(cacheById, visibleCharacterId)
  const cacheRailCharacters = selectCacheRailCharacterIds(cacheOrder).flatMap((characterId) => {
    const cachedCharacter = cacheById[characterId]?.character

    return cachedCharacter ? [cachedCharacter] : []
  })

  const fetchCharacterMutation = useMutation({
    mutationFn: fetchCharacter,
    onSuccess: (character) => {
      upsertCharacter(character)
    },
    onError: (error) => {
      if (error instanceof CharacterNotFoundError) {
        setError(strings.characterNotFound)
        return
      }

      setError(strings.fetchError)
    },
  })

  const onSubmit: SubmitHandler<SearchCharacterFormValues> = async ({ characterId }) => {
    const normalizedId = Number(characterId.trim())
    const cachedEntry = cacheById[normalizedId]

    if (cachedEntry && !isCacheEntryExpired(cachedEntry)) {
      clearError()
      setVisibleCharacter(normalizedId)
      return
    }

    clearError()

    try {
      await fetchCharacterMutation.mutateAsync(normalizedId)
    } catch {
      return
    }
  }
  const handleCharacterSearchSubmit = handleSubmit(onSubmit)
  const screenState = getCharacterBrowserScreenState({
    isLoading: fetchCharacterMutation.isPending,
    errorMessage,
    visibleCharacter,
  })

  function submitCharacterSearch(event: SubmitEvent<HTMLFormElement>): void {
    void handleCharacterSearchSubmit(event)
  }

  function selectCharacter(characterId: number): void {
    setVisibleCharacter(characterId)
  }

  return {
    cacheRailCharacters,
    characterIdField: register('characterId'),
    clearCache,
    errorMessage,
    isLoading: fetchCharacterMutation.isPending,
    removeCharacter,
    screenState,
    selectCharacter,
    submitCharacterSearch,
    visibleCharacter,
    visibleCharacterId,
  }
}

export { useCharacterBrowser }
