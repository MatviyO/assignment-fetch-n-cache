import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/types'

const placeholderImage = '/character-placeholder.png'

interface CharacterPosterProps {
  character: Character | null
  isLoading: boolean
}

function CharacterPoster({ character, isLoading }: CharacterPosterProps): JSX.Element {
  const containerClassName =
    'relative aspect-square w-full overflow-hidden rounded-[6px] bg-[#F5F6FA] shadow-[0_14px_24px_rgba(148,163,184,0.18)] lg:h-[224px] lg:w-[224px]'

  if (isLoading) {
    return (
      <figure aria-label="Character card" className={containerClassName}>
        <div
          role="status"
          aria-live="polite"
          className="flex size-full items-center justify-center"
        >
          <span className="sr-only">Loading character</span>
          <div
            aria-hidden="true"
            className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"
          />
        </div>
      </figure>
    )
  }

  return (
    <figure aria-label="Character card" className={containerClassName}>
      <img
        src={character?.image ?? placeholderImage}
        alt={character ? character.name : 'Character placeholder'}
        className="size-full object-cover"
      />
    </figure>
  )
}

export { CharacterPoster }
