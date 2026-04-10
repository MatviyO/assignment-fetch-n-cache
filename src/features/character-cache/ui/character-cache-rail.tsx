import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/types'
import { CharacterCacheItem } from '@/features/character-cache/ui/character-cache-item'

interface CharacterCacheRailProps {
  characters: Character[]
  selectedCharacterId: number | null
  onRemove: (characterId: number) => void
  onSelect: (characterId: number) => void
}

/**
 * A rail of cached characters that the user can select to view details or remove from the cache.
 */
function CharacterCacheRail({
  characters,
  selectedCharacterId,
  onRemove,
  onSelect,
}: CharacterCacheRailProps): JSX.Element | null {
  if (characters.length === 0) {
    return null
  }

  return (
    <section aria-label="Cached characters">
      <ul className="flex flex-wrap justify-center gap-2.5 pb-1 lg:flex-nowrap lg:flex-col lg:justify-start">
        {characters.map((character) => {
          return (
            <CharacterCacheItem
              key={character.id}
              character={character}
              isSelected={selectedCharacterId === character.id}
              onRemove={onRemove}
              onSelect={onSelect}
            />
          )
        })}
      </ul>
    </section>
  )
}

export { CharacterCacheRail }
