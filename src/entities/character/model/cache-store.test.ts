import {
  CACHE_TTL_MS,
  createCharacterCacheStore,
  MAX_CACHED_CHARACTERS,
} from '@/entities/character/model/cache-store'

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

describe('createCharacterCacheStore', () => {
  test('upsertCharacter caches a character and makes it visible', () => {
    const store = createCharacterCacheStore()

    store.getState().upsertCharacter(galacticPresident)

    expect(store.getState().cacheOrder).toEqual([130])
    expect(store.getState().visibleCharacterId).toBe(130)
    expect(store.getState().cacheById[130]?.character).toEqual(galacticPresident)
  })

  test('removeCharacter deletes a cached character and clears the visible selection', () => {
    const store = createCharacterCacheStore()

    store.getState().upsertCharacter(galacticPresident)
    store.getState().removeCharacter(130)

    expect(store.getState().cacheOrder).toEqual([])
    expect(store.getState().visibleCharacterId).toBeNull()
    expect(store.getState().cacheById[130]).toBeUndefined()
  })

  test('clearCache removes all cached characters and resets the visible selection', () => {
    const store = createCharacterCacheStore()

    store.getState().upsertCharacter(galacticPresident)
    store.getState().clearCache()

    expect(store.getState().cacheById).toEqual({})
    expect(store.getState().cacheOrder).toEqual([])
    expect(store.getState().visibleCharacterId).toBeNull()
  })

  test('pruneExpired removes stale cached characters', () => {
    const nowSpy = jest.spyOn(Date, 'now')
    const store = createCharacterCacheStore()

    nowSpy.mockReturnValue(1_000)
    store.getState().upsertCharacter(galacticPresident)

    nowSpy.mockReturnValue(1_000 + CACHE_TTL_MS + 1)
    store.getState().pruneExpired()

    expect(store.getState().cacheById).toEqual({})
    expect(store.getState().cacheOrder).toEqual([])
    expect(store.getState().visibleCharacterId).toBeNull()

    nowSpy.mockRestore()
  })

  test('upsertCharacter keeps only the three most recent cached characters', () => {
    const store = createCharacterCacheStore()

    store.getState().upsertCharacter({ ...galacticPresident, id: 1, name: 'Rick Sanchez' })
    store.getState().upsertCharacter({ ...galacticPresident, id: 2, name: 'Morty Smith' })
    store.getState().upsertCharacter({ ...galacticPresident, id: 3, name: 'Summer Smith' })
    store.getState().upsertCharacter({ ...galacticPresident, id: 4, name: 'Beth Smith' })

    expect(store.getState().cacheOrder).toHaveLength(MAX_CACHED_CHARACTERS)
    expect(store.getState().cacheOrder).toEqual([2, 3, 4])
    expect(store.getState().cacheById[1]).toBeUndefined()
    expect(store.getState().visibleCharacterId).toBe(4)
  })
})
