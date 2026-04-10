import type { Character, CharacterCacheEntry } from '@/entities/character/model/cache-store'

type CharacterBrowserScreenState = 'idle' | 'loading' | 'error' | 'ready'

interface CharacterBrowserScreenStateInput {
  isLoading: boolean
  errorMessage: string | null
  visibleCharacter: Character | null
}

function selectVisibleCharacter(
  cacheById: Record<number, CharacterCacheEntry>,
  visibleCharacterId: number | null,
): Character | null {
  if (visibleCharacterId === null) {
    return null
  }

  return cacheById[visibleCharacterId]?.character ?? null
}

function selectCacheRailCharacterIds(cacheOrder: number[]): number[] {
  return [...cacheOrder].reverse()
}

function getCharacterBrowserScreenState({
  isLoading,
  errorMessage,
  visibleCharacter,
}: CharacterBrowserScreenStateInput): CharacterBrowserScreenState {
  if (isLoading) {
    return 'loading'
  }

  if (errorMessage) {
    return 'error'
  }

  if (visibleCharacter) {
    return 'ready'
  }

  return 'idle'
}

export type { CharacterBrowserScreenState }
export { getCharacterBrowserScreenState, selectCacheRailCharacterIds, selectVisibleCharacter }
