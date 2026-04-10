import { CACHE_TTL_MS, MAX_CACHED_CHARACTERS } from './config'
import type {
  CharacterCacheEntry,
  CharacterCacheState,
  PersistedCharacterCacheState,
} from './types'

export const isCacheEntryExpired = (entry: CharacterCacheEntry, now = Date.now()) =>
  now - entry.cachedAt > CACHE_TTL_MS

export function trimCacheToLimit(
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

export const createPersistedCharacterCacheSnapshot = (
  state: Pick<CharacterCacheState, 'cacheById' | 'cacheOrder' | 'visibleCharacterId'>,
): PersistedCharacterCacheState => ({
  cacheById: state.cacheById,
  cacheOrder: state.cacheOrder,
  visibleCharacterId: state.visibleCharacterId,
})
