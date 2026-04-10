import { strings } from '@/shared/i18n/strings'
import { CharacterNotFoundError, fetchCharacter } from './fetch-character'

const mockCharacterResponse = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
}

describe('fetchCharacter', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should return a character on successful fetch', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockCharacterResponse,
    })

    const result = await fetchCharacter(1)

    expect(result).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      species: 'Human',
      type: 'Unknown',
      status: 'Alive',
      origin: 'Earth (C-137)',
      location: 'Citadel of Ricks',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    })
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/character/1'))
  })

  it('should throw CharacterNotFoundError when response is 404', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    })

    await expect(fetchCharacter(999)).rejects.toThrow(CharacterNotFoundError)
    await expect(fetchCharacter(999)).rejects.toThrow(strings.characterNotFound)
  })

  it('should throw a generic error when response is not ok and not 404', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    })

    await expect(fetchCharacter(1)).rejects.toThrow('Failed to fetch character')
  })

  it('should handle optional fields correctly with defaults', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ...mockCharacterResponse,
        species: '',
        type: '',
        origin: { name: '' },
        location: { name: '' },
      }),
    })

    const result = await fetchCharacter(1)

    expect(result.species).toBe('Unknown')
    expect(result.type).toBe('Unknown')
    expect(result.origin).toBe('Unknown')
    expect(result.location).toBe('Unknown')
  })
})
