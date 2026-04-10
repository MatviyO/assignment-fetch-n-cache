import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/types'
import { cn } from '@/shared/lib/cn'
import { CloseIcon } from '@/shared/ui/icons/close-icon'

interface CharacterCacheItemProps {
  character: Character
  isSelected: boolean
  onRemove: (characterId: number) => void
  onSelect: (characterId: number) => void
}

/**
 * A single item in the cached character rail.
 */
function CharacterCacheItem({
  character,
  isSelected,
  onRemove,
  onSelect,
}: CharacterCacheItemProps): JSX.Element {
  return (
    <li className="relative list-none">
      <button
        type="button"
        aria-label={`Show ${character.name}`}
        aria-pressed={isSelected}
        onClick={() => onSelect(character.id)}
        className={cn(
          'cursor-pointer border bg-white p-0 transition-all duration-200',
          isSelected
            ? 'size-[66px] rounded-[10px] border-[#0005FF] p-[3px]'
            : 'size-[60px] rounded-[10px] border-slate-200 opacity-60 hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        <img
          src={character.image}
          alt={character.name}
          className={cn('size-full object-cover', isSelected ? 'rounded-[7px]' : 'rounded-[9px]')}
        />
      </button>

      <button
        type="button"
        aria-label={`Remove ${character.name}`}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(character.id)
        }}
        className={cn(
          'absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full',
          'bg-slate-200 text-[10px] font-bold text-slate-700 transition-colors duration-200',
          'hover:bg-slate-300 hover:text-slate-900 focus-visible:bg-slate-300 focus-visible:outline-none',
        )}
      >
        <CloseIcon className="size-2" />
      </button>
    </li>
  )
}

export { CharacterCacheItem }
