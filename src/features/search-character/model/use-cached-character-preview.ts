import { useEffect } from 'react'

import { useCharacterCacheStore } from '@/entities/character/model/cache-store'
import { isCacheEntryExpired } from '@/entities/character/model/cache-utils'

interface PreviewCachedCharacterInput {
  watchedCharacterId: string
}

export function useCachedCharacterPreview({
  watchedCharacterId,
}: PreviewCachedCharacterInput): void {
  const cacheById = useCharacterCacheStore((state) => state.cacheById)
  const setVisibleCharacter = useCharacterCacheStore((state) => state.setVisibleCharacter)
  const clearError = useCharacterCacheStore((state) => state.clearError)

  useEffect(() => {
    const trimmedCharacterId = watchedCharacterId.trim()

    if (!trimmedCharacterId) {
      setVisibleCharacter(null)
      return
    }

    const normalizedId = Number(trimmedCharacterId)

    if (!Number.isInteger(normalizedId) || normalizedId < 1) {
      return
    }

    const cachedEntry = cacheById[normalizedId]

    if (cachedEntry && !isCacheEntryExpired(cachedEntry)) {
      clearError()
      setVisibleCharacter(normalizedId)
    }
  }, [cacheById, clearError, setVisibleCharacter, watchedCharacterId])
}
