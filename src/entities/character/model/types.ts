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

export interface CharacterCacheState {
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

export type PersistedCharacterCacheState = Pick<
  CharacterCacheState,
  'cacheById' | 'cacheOrder' | 'visibleCharacterId'
>
