import type { JSX } from 'react'
import type { CharacterDetailRow } from '@/entities/character/lib/get-character-detail-rows'

interface CharacterDetailItemProps {
  detailRow: CharacterDetailRow
}

function CharacterDetailItem({ detailRow }: CharacterDetailItemProps): JSX.Element {
  return (
    <div className="flex w-full justify-between gap-4 lg:contents">
      <dt className="shrink-0 font-normal text-label-gray">{detailRow.label}</dt>
      <dd className={`${detailRow.valueClassName} text-right lg:text-left`}>{detailRow.value}</dd>
    </div>
  )
}

export { CharacterDetailItem }
