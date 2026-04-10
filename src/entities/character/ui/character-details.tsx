import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/cache-store'

import { getCharacterDetailRows } from '@/entities/character/lib/get-character-detail-rows'

interface CharacterDetailsProps {
  character: Character
}

function CharacterDetails({ character }: CharacterDetailsProps): JSX.Element {
  const detailRows = getCharacterDetailRows(character)

  return (
    <div className="flex flex-col gap-[14px]">
      <h1 className="max-w-[560px] break-words text-[32px] font-bold leading-[0.94] tracking-[-0.05em] text-slate-950">
        {character.name}
      </h1>

      <dl className="grid max-w-[360px] grid-cols-[auto_1fr] gap-x-5 gap-y-[9px] text-[16px] leading-6">
        {detailRows.map((detailRow) => (
          <div key={detailRow.label} className="contents">
            <dt className="font-normal text-slate-400">{detailRow.label}</dt>
            <dd className={detailRow.valueClassName}>{detailRow.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { CharacterDetails }
