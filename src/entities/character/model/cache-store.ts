import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { isCacheEntryExpired, trimCacheToLimit } from './cache-utils'
import { CHARACTER_CACHE_STORAGE_KEY } from './config'
import type {
  CharacterCacheEntry,
  CharacterCacheState,
  PersistedCharacterCacheState,
} from './types'

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

export const useCharacterCacheStore = <T>(selector: (state: CharacterCacheState) => T) =>
  useStore(characterCacheStore, selector)

export * from './cache-utils'
export * from './config'
export * from './types'
