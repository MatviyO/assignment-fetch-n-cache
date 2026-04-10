import type { JSX } from 'react'
import { getCharacterDetailRows } from '@/entities/character/lib/get-character-detail-rows'
import type { Character } from '@/entities/character/model/types'
import { CharacterDetailItem } from '@/entities/character/ui/character-detail-item'

interface CharacterDetailsProps {
  character: Character
}

function CharacterDetails({ character }: CharacterDetailsProps): JSX.Element {
  const detailRows = getCharacterDetailRows(character)

  return (
    <div className="animate-fade-in-up flex flex-col gap-[14px]">
      <h2 className="max-w-[560px] break-words text-[32px] font-bold leading-[0.94] tracking-[-0.05em] text-slate-950">
        {character.name}
      </h2>

      <dl className="grid max-w-[560px] grid-cols-1 gap-y-[9px] text-[16px] leading-6 lg:grid-cols-[auto_1fr] lg:gap-x-5">
        {detailRows.map((detailRow) => (
          <CharacterDetailItem key={detailRow.label} detailRow={detailRow} />
        ))}
      </dl>
    </div>
  )
}

export { CharacterDetails }
