import { renderHook } from '@testing-library/react'

import { characterCacheStore } from '@/entities/character/model/cache-store'
import { CACHE_TTL_MS, CHARACTER_CACHE_STORAGE_KEY } from '@/entities/character/model/config'
import type { Character } from '@/entities/character/model/types'
import { useCharacterCachePersistence } from '@/entities/character/model/use-character-cache-persistence'

const rickSanchez: Character = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  species: 'Human',
  type: 'Unknown',
  location: 'Citadel of Ricks',
  origin: 'Earth (C-137)',
  status: 'Alive',
}

describe('useCharacterCachePersistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
    characterCacheStore.getState().clearCache()
  })

  test('hydrates the in-memory cache from localStorage on mount', () => {
    const persistedState = {
      cacheById: { 1: { character: rickSanchez, cachedAt: Date.now() } },
      cacheOrder: [1],
      visibleCharacterId: 1,
    }
    window.localStorage.setItem(CHARACTER_CACHE_STORAGE_KEY, JSON.stringify(persistedState))

    renderHook(() => useCharacterCachePersistence())

    expect(characterCacheStore.getState().cacheById[1]?.character).toMatchObject({
      id: 1,
      name: 'Rick Sanchez',
    })
    expect(characterCacheStore.getState().visibleCharacterId).toBe(1)
  })

  test('discards expired entries found in localStorage on mount', () => {
    const expiredAt = Date.now() - CACHE_TTL_MS - 1
    const persistedState = {
      cacheById: { 1: { character: rickSanchez, cachedAt: expiredAt } },
      cacheOrder: [1],
      visibleCharacterId: 1,
    }
    window.localStorage.setItem(CHARACTER_CACHE_STORAGE_KEY, JSON.stringify(persistedState))

    renderHook(() => useCharacterCachePersistence())

    expect(characterCacheStore.getState().cacheById[1]).toBeUndefined()
    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()
  })

  test('persists a cache snapshot to localStorage when the store changes', () => {
    renderHook(() => useCharacterCachePersistence())

    characterCacheStore.getState().upsertCharacter(rickSanchez)

    const raw = window.localStorage.getItem(CHARACTER_CACHE_STORAGE_KEY)
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw ?? '')
    expect(parsed.cacheOrder).toContain(1)
    expect(parsed.cacheById[1].character).toMatchObject({ id: 1, name: 'Rick Sanchez' })
  })

  test('stops writing to localStorage after the hook unmounts', () => {
    const { unmount } = renderHook(() => useCharacterCachePersistence())
    unmount()

    window.localStorage.clear()
    characterCacheStore.getState().upsertCharacter(rickSanchez)

    expect(window.localStorage.getItem(CHARACTER_CACHE_STORAGE_KEY)).toBeNull()
  })

  test('does not throw and leaves the cache empty when localStorage contains malformed JSON', () => {
    window.localStorage.setItem(CHARACTER_CACHE_STORAGE_KEY, 'INVALID_JSON')

    expect(() => renderHook(() => useCharacterCachePersistence())).not.toThrow()
    expect(characterCacheStore.getState().cacheById).toEqual({})
    expect(characterCacheStore.getState().cacheOrder).toEqual([])
  })
})
