import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/cache-store'
import { CharacterDetails } from '@/entities/character/ui/character-details'
import type { CharacterBrowserScreenState } from '@/widgets/character-browser/model/character-browser-view'
import { ErrorState } from '@/widgets/character-browser/ui/error-state'

interface CharacterBrowserContentProps {
  errorMessage: string | null
  screenState: CharacterBrowserScreenState
  visibleCharacter: Character | null
}

function CharacterBrowserContent({
  errorMessage,
  screenState,
  visibleCharacter,
}: CharacterBrowserContentProps): JSX.Element | null {
  if (screenState === 'loading') {
    return null
  }

  if (screenState === 'error' && errorMessage) {
    return <ErrorState errorMessage={errorMessage} />
  }

  if (screenState === 'ready' && visibleCharacter) {
    return <CharacterDetails character={visibleCharacter} />
  }

  return null
}

export { CharacterBrowserContent }
