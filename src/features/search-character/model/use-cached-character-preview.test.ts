import { renderHook } from '@testing-library/react'

import { characterCacheStore } from '@/entities/character/model/cache-store'
import { CACHE_TTL_MS } from '@/entities/character/model/config'
import type { Character } from '@/entities/character/model/types'
import { useCachedCharacterPreview } from './use-cached-character-preview'

const mortySmith: Character = {
  id: 2,
  name: 'Morty Smith',
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  species: 'Human',
  type: 'Unknown',
  location: 'Earth',
  origin: 'Earth (C-137)',
  status: 'Alive',
}

describe('useCachedCharacterPreview', () => {
  beforeEach(() => {
    characterCacheStore.getState().clearCache()
  })

  test('sets the visible character when the typed ID matches a cached non-expired entry', () => {
    characterCacheStore.getState().upsertCharacter(mortySmith)
    characterCacheStore.getState().setVisibleCharacter(null)

    renderHook(() => useCachedCharacterPreview({ watchedCharacterId: '2' }))

    expect(characterCacheStore.getState().visibleCharacterId).toBe(2)
  })

  test('clears any existing error when previewing a valid cached entry', () => {
    characterCacheStore.getState().upsertCharacter(mortySmith)
    characterCacheStore.getState().setError('Previous error')
    characterCacheStore.getState().setVisibleCharacter(null)

    renderHook(() => useCachedCharacterPreview({ watchedCharacterId: '2' }))

    expect(characterCacheStore.getState().errorMessage).toBeNull()
  })

  test('clears the visible character when the watched ID becomes empty', () => {
    characterCacheStore.getState().upsertCharacter(mortySmith)
    // visibleCharacterId is 2 after upsert

    renderHook(() => useCachedCharacterPreview({ watchedCharacterId: '' }))

    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()
  })

  test('clears the visible character when the watched ID is changed to empty', () => {
    characterCacheStore.getState().upsertCharacter(mortySmith)

    const { rerender } = renderHook(
      ({ characterId }: { characterId: string }) =>
        useCachedCharacterPreview({ watchedCharacterId: characterId }),
      { initialProps: { characterId: '2' } },
    )

    expect(characterCacheStore.getState().visibleCharacterId).toBe(2)

    rerender({ characterId: '' })

    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()
  })

  test.each([
    ['non-numeric string', 'abc'],
    ['negative number', '-1'],
    ['decimal number', '1.5'],
    ['zero', '0'],
  ])('does nothing when the watched ID is a %s (%s)', (_, watchedCharacterId) => {
    renderHook(() => useCachedCharacterPreview({ watchedCharacterId }))

    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()
  })

  test('does nothing when the typed ID is not present in the cache', () => {
    renderHook(() => useCachedCharacterPreview({ watchedCharacterId: '999' }))

    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()
  })

  test('does nothing when the matching cache entry has expired', () => {
    const nowSpy = jest.spyOn(Date, 'now')

    nowSpy.mockReturnValue(1_000)
    characterCacheStore.getState().upsertCharacter(mortySmith)
    characterCacheStore.getState().setVisibleCharacter(null)

    nowSpy.mockReturnValue(1_000 + CACHE_TTL_MS + 1)
    renderHook(() => useCachedCharacterPreview({ watchedCharacterId: '2' }))

    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()

    nowSpy.mockRestore()
  })

  test('updates the preview when watchedCharacterId changes to a cached value', () => {
    characterCacheStore.getState().upsertCharacter(mortySmith)
    characterCacheStore.getState().setVisibleCharacter(null)

    const { rerender } = renderHook(
      ({ characterId }: { characterId: string }) =>
        useCachedCharacterPreview({ watchedCharacterId: characterId }),
      { initialProps: { characterId: '' } },
    )

    expect(characterCacheStore.getState().visibleCharacterId).toBeNull()

    rerender({ characterId: '2' })

    expect(characterCacheStore.getState().visibleCharacterId).toBe(2)
  })
})
