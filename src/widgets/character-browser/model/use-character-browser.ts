import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { type FormEvent, type FormEventHandler, useEffect } from 'react'
import { type SubmitHandler, type UseFormRegisterReturn, useForm, useWatch } from 'react-hook-form'

import {
  CHARACTER_CACHE_STORAGE_KEY,
  type Character,
  type CharacterCacheEntry,
  characterCacheStore,
  createPersistedCharacterCacheSnapshot,
  isCacheEntryExpired,
  useCharacterCacheStore,
} from '@/entities/character/model/cache-store'
import {
  type SearchCharacterFormValues,
  searchCharacterSchema,
} from '@/features/search-character/model/search-character-form'
import { CharacterNotFoundError, fetchCharacter } from '@/shared/api/fetch-character'
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
  submitCharacterSearch: FormEventHandler<HTMLFormElement>
  visibleCharacter: Character | null
  visibleCharacterId: number | null
}

interface PreviewCachedCharacterInput {
  cacheById: Record<number, CharacterCacheEntry>
  clearError: () => void
  setVisibleCharacter: (characterId: number) => void
  watchedCharacterId: string
}

function useCharacterCachePersistence(): void {
  useEffect(() => {
    characterCacheStore.getState().hydratePersistedCache()
    characterCacheStore.getState().pruneExpired()

    const unsubscribe = characterCacheStore.subscribe((state) => {
      window.localStorage.setItem(
        CHARACTER_CACHE_STORAGE_KEY,
        JSON.stringify(createPersistedCharacterCacheSnapshot(state)),
      )
    })

    return unsubscribe
  }, [])
}

function useCachedCharacterPreview({
  cacheById,
  clearError,
  setVisibleCharacter,
  watchedCharacterId,
}: PreviewCachedCharacterInput): void {
  useEffect(() => {
    const trimmedCharacterId = watchedCharacterId.trim()

    if (!trimmedCharacterId) {
      return
    }

    const normalizedId = Number(trimmedCharacterId)

    if (!Number.isInteger(normalizedId) || normalizedId < 1) {
      return
    }

    const cachedEntry = cacheById[normalizedId]

    if (cachedEntry && !isCacheEntryExpired(cachedEntry)) {
      clearError()
      setVisibleCharacter(normalizedId)
    }
  }, [cacheById, clearError, setVisibleCharacter, watchedCharacterId])
}

function useCharacterBrowser(): UseCharacterBrowserResult {
  const { control, handleSubmit, register } = useForm<SearchCharacterFormValues>({
    defaultValues: {
      characterId: '',
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

  useCharacterCachePersistence()
  useCachedCharacterPreview({
    cacheById,
    clearError,
    setVisibleCharacter,
    watchedCharacterId,
  })

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
        setError('Character not found')
        return
      }

      setError('Something went wrong while fetching the character.')
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

  function submitCharacterSearch(event: FormEvent<HTMLFormElement>): void {
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
