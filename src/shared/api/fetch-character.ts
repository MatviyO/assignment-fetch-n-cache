import type { Character } from '@/entities/character/model/cache-store'

interface RickAndMortyCharacterResponse {
  id: number
  name: string
  image: string
  species: string
  type: string
  status: Character['status']
  origin: {
    name: string
  }
  location: {
    name: string
  }
}

export class CharacterNotFoundError extends Error {
  constructor() {
    super('Character not found')
    this.name = 'CharacterNotFoundError'
  }
}

export async function fetchCharacter(characterId: number): Promise<Character> {
  const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`)

  if (response.status === 404) {
    throw new CharacterNotFoundError()
  }

  if (!response.ok) {
    throw new Error('Failed to fetch character')
  }

  const payload = (await response.json()) as RickAndMortyCharacterResponse

  return {
    id: payload.id,
    name: payload.name,
    image: payload.image,
    species: payload.species || 'Unknown',
    type: payload.type || 'Unknown',
    status: payload.status,
    origin: payload.origin.name || 'Unknown',
    location: payload.location.name || 'Unknown',
  }
}
