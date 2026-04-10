import type { Character } from '@/entities/character/model/types'
import { strings } from '@/shared/i18n/strings'
import { getCharacterDetailRows } from './get-character-detail-rows'

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  species: 'Human',
  type: '',
  location: 'Citadel of Ricks',
  origin: 'Earth (C-137)',
  status: 'Alive',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
}

describe('getCharacterDetailRows', () => {
  it('should return exactly 5 rows with correct labels and values', () => {
    const rows = getCharacterDetailRows(mockCharacter)
    const { characterLabels } = strings

    expect(rows).toHaveLength(5)

    expect(rows[0]).toEqual({
      label: characterLabels.species,
      value: 'Human',
      valueClassName: 'font-bold text-slate-900',
    })

    expect(rows[1]).toEqual({
      label: characterLabels.type,
      value: '',
      valueClassName: 'font-bold text-slate-900',
    })

    expect(rows[2]).toEqual({
      label: characterLabels.location,
      value: 'Citadel of Ricks',
      valueClassName: 'font-bold text-label-gray',
    })

    expect(rows[3]).toEqual({
      label: characterLabels.origin,
      value: 'Earth (C-137)',
      valueClassName: 'font-bold text-label-gray',
    })

    expect(rows[4]).toEqual({
      label: characterLabels.status,
      value: 'Alive',
      valueClassName: 'font-bold text-red-600',
    })
  })
})
