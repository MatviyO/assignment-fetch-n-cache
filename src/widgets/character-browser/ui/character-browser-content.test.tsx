import { render, screen } from '@testing-library/react'

import { CharacterBrowserContent } from '@/widgets/character-browser/ui/character-browser-content'
import { ErrorState } from '@/widgets/character-browser/ui/error-state'

const visibleCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  species: 'Human',
  type: 'Unknown',
  status: 'Alive' as const,
  origin: 'Earth (C-137)',
  location: 'Citadel of Ricks',
}

describe('CharacterBrowserContent', () => {
  test('renders the error message through ErrorState', () => {
    render(<ErrorState errorMessage="Character not found" />)

    expect(screen.getByText('Character not found')).toBeInTheDocument()
  })

  test('renders the visible character details when screen state is ready', () => {
    render(
      <CharacterBrowserContent
        errorMessage={null}
        screenState="ready"
        visibleCharacter={visibleCharacter}
      />,
    )

    const heading = screen.getByRole('heading', { name: /rick sanchez/i })

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('text-[32px]')
    expect(heading).toHaveClass('font-bold')
  })
})
