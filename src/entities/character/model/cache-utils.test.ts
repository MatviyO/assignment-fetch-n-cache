import {
  createPersistedCharacterCacheSnapshot,
  isCacheEntryExpired,
  trimCacheToLimit,
} from './cache-utils'
import { CACHE_TTL_MS, MAX_CACHED_CHARACTERS } from './config'
import type { CharacterCacheEntry, CharacterCacheState } from './types'

const galacticPresident = {
  id: 130,
  name: 'Galactic Federation President',
  image: 'https://rickandmortyapi.com/api/character/avatar/130.jpeg',
  species: 'Alien',
  type: 'Gromflomite',
  location: 'Unknown',
  origin: 'Unknown',
  status: 'Dead' as const,
}

describe('cache-utils', () => {
  describe('isCacheEntryExpired', () => {
    test('returns true if entry is older than TTL', () => {
      const entry: CharacterCacheEntry = {
        character: galacticPresident,
        cachedAt: 1000,
      }
      const now = 1000 + CACHE_TTL_MS + 1
      expect(isCacheEntryExpired(entry, now)).toBe(true)
    })

    test('returns false if entry is within TTL', () => {
      const entry: CharacterCacheEntry = {
        character: galacticPresident,
        cachedAt: 1000,
      }
      const now = 1000 + CACHE_TTL_MS - 1
      expect(isCacheEntryExpired(entry, now)).toBe(false)
    })
  })

  describe('trimCacheToLimit', () => {
    test('keeps characters within limit', () => {
      const cacheById = {
        1: { character: { ...galacticPresident, id: 1 }, cachedAt: 1 },
        2: { character: { ...galacticPresident, id: 2 }, cachedAt: 2 },
      }
      const cacheOrder = [1, 2]

      const result = trimCacheToLimit(cacheById, cacheOrder)
      expect(result.cacheOrder).toEqual([1, 2])
      expect(Object.keys(result.cacheById)).toHaveLength(2)
    })

    test('trims characters exceeding limit', () => {
      const cacheById: Record<number, CharacterCacheEntry> = {
        1: { character: { ...galacticPresident, id: 1 }, cachedAt: 1 },
        2: { character: { ...galacticPresident, id: 2 }, cachedAt: 2 },
        3: { character: { ...galacticPresident, id: 3 }, cachedAt: 3 },
        4: { character: { ...galacticPresident, id: 4 }, cachedAt: 4 },
      }
      const cacheOrder = [1, 2, 3, 4]

      const result = trimCacheToLimit(cacheById, cacheOrder)
      expect(result.cacheOrder).toHaveLength(MAX_CACHED_CHARACTERS)
      expect(result.cacheOrder).toEqual([2, 3, 4])
      expect(result.cacheById[1]).toBeUndefined()
      expect(result.cacheById[2]).toBeDefined()
    })
  })

  describe('createPersistedCharacterCacheSnapshot', () => {
    test('creates a snapshot with only persistence-related fields', () => {
      const state: Partial<CharacterCacheState> = {
        cacheById: {
          130: { character: galacticPresident, cachedAt: 1000 },
        },
        cacheOrder: [130],
        visibleCharacterId: 130,
        errorMessage: 'Some error',
      }

      const snapshot = createPersistedCharacterCacheSnapshot(state as CharacterCacheState)
      expect(snapshot).toEqual({
        cacheById: state.cacheById,
        cacheOrder: state.cacheOrder,
        visibleCharacterId: state.visibleCharacterId,
      })
      expect(snapshot).not.toHaveProperty('errorMessage')
    })
  })
})
