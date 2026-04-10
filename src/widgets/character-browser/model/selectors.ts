import type { Character, CharacterCacheEntry } from '@/entities/character/model/types'

export function selectVisibleCharacter(
  cacheById: Record<number, CharacterCacheEntry>,
  visibleCharacterId: number | null,
): Character | null {
  if (visibleCharacterId === null) {
    return null
  }

  return cacheById[visibleCharacterId]?.character ?? null
}

export function selectCacheRailCharacterIds(cacheOrder: number[]): number[] {
  return [...cacheOrder].reverse()
}
