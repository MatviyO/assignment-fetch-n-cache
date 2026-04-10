import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000
export const MAX_CACHED_CHARACTERS = 3
export const CHARACTER_CACHE_STORAGE_KEY = 'fetch-n-cache-store-v1'

export interface Character {
  id: number
  name: string
  image: string
  species: string
  type: string
  location: string
  origin: string
  status: 'Alive' | 'Dead' | 'unknown'
}

export interface CharacterCacheEntry {
  character: Character
  cachedAt: number
}

interface CharacterCacheState {
  cacheById: Record<number, CharacterCacheEntry>
  cacheOrder: number[]
  visibleCharacterId: number | null
  errorMessage: string | null
  upsertCharacter: (character: Character) => void
  removeCharacter: (characterId: number) => void
  clearCache: () => void
  pruneExpired: () => void
  setVisibleCharacter: (characterId: number | null) => void
  setError: (message: string | null) => void
  clearError: () => void
  hydratePersistedCache: () => void
}

type PersistedCharacterCacheState = Pick<
  CharacterCacheState,
  'cacheById' | 'cacheOrder' | 'visibleCharacterId'
>

export const isCacheEntryExpired = (entry: CharacterCacheEntry, now = Date.now()) =>
  now - entry.cachedAt > CACHE_TTL_MS

function trimCacheToLimit(
  cacheById: Record<number, CharacterCacheEntry>,
  cacheOrder: number[],
): Pick<CharacterCacheState, 'cacheById' | 'cacheOrder'> {
  if (cacheOrder.length <= MAX_CACHED_CHARACTERS) {
    return {
      cacheById,
      cacheOrder,
    }
  }

  const nextCacheOrder = cacheOrder.slice(-MAX_CACHED_CHARACTERS)
  const nextCacheById = Object.fromEntries(
    nextCacheOrder.map((characterId) => [characterId, cacheById[characterId]]),
  ) as Record<number, CharacterCacheEntry>

  return {
    cacheById: nextCacheById,
    cacheOrder: nextCacheOrder,
  }
}

export const createCharacterCacheStore = () =>
  createStore<CharacterCacheState>()((set) => ({
    cacheById: {},
    cacheOrder: [],
    visibleCharacterId: null,
    errorMessage: null,
    upsertCharacter: (character) =>
      set((state) => {
        const alreadyCached = Boolean(state.cacheById[character.id])
        const nextCacheById = {
          ...state.cacheById,
          [character.id]: {
            character,
            cachedAt: Date.now(),
          },
        }
        const nextCacheOrder = alreadyCached
          ? state.cacheOrder
          : [...state.cacheOrder, character.id]
        const trimmedCache = trimCacheToLimit(nextCacheById, nextCacheOrder)

        return {
          cacheById: trimmedCache.cacheById,
          cacheOrder: trimmedCache.cacheOrder,
          visibleCharacterId: character.id,
          errorMessage: null,
        }
      }),
    removeCharacter: (characterId) =>
      set((state) => {
        const nextCacheById = { ...state.cacheById }

        delete nextCacheById[characterId]

        return {
          cacheById: nextCacheById,
          cacheOrder: state.cacheOrder.filter((cachedId) => cachedId !== characterId),
          visibleCharacterId:
            state.visibleCharacterId === characterId ? null : state.visibleCharacterId,
        }
      }),
    clearCache: () =>
      set({
        cacheById: {},
        cacheOrder: [],
        visibleCharacterId: null,
        errorMessage: null,
      }),
    pruneExpired: () =>
      set((state) => {
        const now = Date.now()
        const nextCacheById = Object.fromEntries(
          Object.entries(state.cacheById).filter(([, entry]) => {
            return !isCacheEntryExpired(entry, now)
          }),
        )
        const nextCacheOrder = state.cacheOrder.filter((characterId) =>
          Boolean(nextCacheById[characterId]),
        )
        const nextVisibleCharacterId =
          state.visibleCharacterId !== null && nextCacheById[state.visibleCharacterId]
            ? state.visibleCharacterId
            : null

        return {
          cacheById: nextCacheById,
          cacheOrder: nextCacheOrder,
          visibleCharacterId: nextVisibleCharacterId,
        }
      }),
    setVisibleCharacter: (characterId) =>
      set({
        visibleCharacterId: characterId,
      }),
    setError: (message) =>
      set({
        errorMessage: message,
      }),
    clearError: () =>
      set({
        errorMessage: null,
      }),
    hydratePersistedCache: () =>
      set(() => {
        if (typeof window === 'undefined') {
          return {}
        }

        const persistedCache = window.localStorage.getItem(CHARACTER_CACHE_STORAGE_KEY)

        if (!persistedCache) {
          return {}
        }

        try {
          const parsedCache = JSON.parse(persistedCache) as PersistedCharacterCacheState
          const nextCacheById = Object.fromEntries(
            Object.entries(parsedCache.cacheById ?? {}).filter(([, entry]) => {
              return !isCacheEntryExpired(entry)
            }),
          ) as Record<number, CharacterCacheEntry>
          const nextCacheOrder = (parsedCache.cacheOrder ?? []).filter(
            (characterId) => nextCacheById[characterId],
          )
          const trimmedCache = trimCacheToLimit(nextCacheById, nextCacheOrder)
          const nextVisibleCharacterId =
            parsedCache.visibleCharacterId !== null &&
            trimmedCache.cacheById[parsedCache.visibleCharacterId]
              ? parsedCache.visibleCharacterId
              : (trimmedCache.cacheOrder.at(-1) ?? null)

          return {
            cacheById: trimmedCache.cacheById,
            cacheOrder: trimmedCache.cacheOrder,
            visibleCharacterId: nextVisibleCharacterId,
            errorMessage: null,
          }
        } catch {
          return {
            cacheById: {},
            cacheOrder: [],
            visibleCharacterId: null,
            errorMessage: null,
          }
        }
      }),
  }))

export const characterCacheStore = createCharacterCacheStore()

export const createPersistedCharacterCacheSnapshot = (
  state: Pick<CharacterCacheState, 'cacheById' | 'cacheOrder' | 'visibleCharacterId'>,
): PersistedCharacterCacheState => ({
  cacheById: state.cacheById,
  cacheOrder: state.cacheOrder,
  visibleCharacterId: state.visibleCharacterId,
})

export const useCharacterCacheStore = <T>(selector: (state: CharacterCacheState) => T) =>
  useStore(characterCacheStore, selector)
