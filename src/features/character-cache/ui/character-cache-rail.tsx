import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/cache-store'
import { cn } from '@/shared/lib/cn'

interface CharacterCacheRailProps {
  characters: Character[]
  selectedCharacterId: number | null
  onRemove: (characterId: number) => void
  onSelect: (characterId: number) => void
}

interface CharacterCacheListProps {
  characters: Character[]
  selectedCharacterId: number | null
  onRemove: (characterId: number) => void
  onSelect: (characterId: number) => void
}

interface CharacterCacheListItemProps {
  character: Character
  isSelected: boolean
  onRemove: (characterId: number) => void
  onSelect: (characterId: number) => void
}

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
      <CharacterCacheList
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onRemove={onRemove}
        onSelect={onSelect}
      />
    </section>
  )
}

function CharacterCacheList({
  characters,
  selectedCharacterId,
  onRemove,
  onSelect,
}: CharacterCacheListProps): JSX.Element {
  return (
    <ul className="flex gap-[10px] pb-1 lg:flex-col">
      {characters.map((character) => {
        return (
          <CharacterCacheListItem
            key={character.id}
            character={character}
            isSelected={selectedCharacterId === character.id}
            onRemove={onRemove}
            onSelect={onSelect}
          />
        )
      })}
    </ul>
  )
}

function CharacterCacheListItem({
  character,
  isSelected,
  onRemove,
  onSelect,
}: CharacterCacheListItemProps): JSX.Element {
  return (
    <li className="relative list-none">
      <button
        type="button"
        aria-label={`Show ${character.name}`}
        aria-pressed={isSelected}
        onClick={() => onSelect(character.id)}
        className={cn(
          'size-[60px] rounded-[10px] border bg-white p-0 transition',
          isSelected
            ? 'border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.28)]'
            : 'border-slate-200 opacity-60 hover:opacity-100',
        )}
      >
        <img
          src={character.image}
          alt={character.name}
          className="size-full rounded-[10px] object-cover"
        />
      </button>

      <button
        type="button"
        aria-label={`Remove ${character.name}`}
        onClick={() => onRemove(character.id)}
        className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-300"
      >
        X
      </button>
    </li>
  )
}

export { CharacterCacheRail }
