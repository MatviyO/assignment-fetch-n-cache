import type { Character } from '@/entities/character/model/types'

export type CharacterBrowserScreenState = 'idle' | 'loading' | 'error' | 'ready'

interface CharacterBrowserScreenStateInput {
  isLoading: boolean
  errorMessage: string | null
  visibleCharacter: Character | null
}

export function getCharacterBrowserScreenState({
  isLoading,
  errorMessage,
  visibleCharacter,
}: CharacterBrowserScreenStateInput): CharacterBrowserScreenState {
  if (isLoading) {
    return 'loading'
  }

  if (errorMessage) {
    return 'error'
  }

  if (visibleCharacter) {
    return 'ready'
  }

  return 'idle'
}
