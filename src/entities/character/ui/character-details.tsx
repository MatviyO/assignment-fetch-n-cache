import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/cache-store'

interface CharacterDetailRow {
  label: string
  value: string
  valueClassName: string
}

interface CharacterDetailsProps {
  character: Character
}

function getCharacterDetailRows(character: Character): CharacterDetailRow[] {
  return [
    {
      label: 'Species',
      value: character.species,
      valueClassName: 'font-semibold text-slate-900',
    },
    {
      label: 'Type',
      value: character.type,
      valueClassName: 'font-semibold text-slate-900',
    },
    {
      label: 'Location',
      value: character.location,
      valueClassName: 'font-semibold text-slate-400',
    },
    {
      label: 'Origin',
      value: character.origin,
      valueClassName: 'font-semibold text-slate-400',
    },
    {
      label: 'Status',
      value: character.status,
      valueClassName: 'font-semibold text-red-600',
    },
  ]
}

function CharacterDetails({ character }: CharacterDetailsProps): JSX.Element {
  const detailRows = getCharacterDetailRows(character)

  return (
    <div className="flex min-h-[220px] flex-col gap-7 lg:min-h-[300px]">
      <h1 className="max-w-[560px] text-[32px] font-bold leading-[0.94] tracking-[-0.05em] text-slate-950">
        {character.name}
      </h1>

      <dl className="grid max-w-[360px] grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-[15px] leading-6">
        {detailRows.map((detailRow) => (
          <div key={detailRow.label} className="contents">
            <dt className="text-slate-400">{detailRow.label}</dt>
            <dd className={detailRow.valueClassName}>{detailRow.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { CharacterDetails }
