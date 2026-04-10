import type { Character } from '@/entities/character/model/types'
import { strings } from '@/shared/i18n/strings'

export interface CharacterDetailRow {
  label: string
  value: string
  valueClassName: string
}

export function getCharacterDetailRows(character: Character): CharacterDetailRow[] {
  const { characterLabels } = strings

  return [
    {
      label: characterLabels.species,
      value: character.species,
      valueClassName: 'font-bold text-slate-900',
    },
    {
      label: characterLabels.type,
      value: character.type,
      valueClassName: 'font-bold text-slate-900',
    },
    {
      label: characterLabels.location,
      value: character.location,
      valueClassName: 'font-bold text-label-gray',
    },
    {
      label: characterLabels.origin,
      value: character.origin,
      valueClassName: 'font-bold text-label-gray',
    },
    {
      label: characterLabels.status,
      value: character.status,
      valueClassName: 'font-bold text-red-600',
    },
  ]
}
