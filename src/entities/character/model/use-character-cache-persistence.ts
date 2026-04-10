import { useEffect, useRef } from 'react'

import { characterCacheStore } from './cache-store'
import { createPersistedCharacterCacheSnapshot } from './cache-utils'
import { CHARACTER_CACHE_STORAGE_KEY } from './config'

export function useCharacterCachePersistence(): void {
  const isHydrated = useRef(false)

  // Ensure hydration happens once and as early as possible on the client
  if (!isHydrated.current && typeof window !== 'undefined') {
    characterCacheStore.getState().hydratePersistedCache()
    characterCacheStore.getState().pruneExpired()
    isHydrated.current = true
  }

  useEffect(() => {
    const unsubscribe = characterCacheStore.subscribe((state) => {
      window.localStorage.setItem(
        CHARACTER_CACHE_STORAGE_KEY,
        JSON.stringify(createPersistedCharacterCacheSnapshot(state)),
      )
    })

    return unsubscribe
  }, [])
}
