import { render, screen } from '@testing-library/react'

import { strings } from '@/shared/i18n/strings'
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
    render(<ErrorState errorMessage={strings.characterNotFound} />)

    expect(screen.getByText(strings.characterNotFound)).toBeInTheDocument()
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

    const detailList = screen.getByText('Species').closest('dl')

    expect(detailList).not.toBeNull()
    expect(detailList).toHaveClass('text-[16px]')

    const { characterLabels } = strings

    for (const label of Object.values(characterLabels)) {
      expect(screen.getByText(label)).toHaveClass('font-normal')
    }

    expect(screen.getByText('Human')).toHaveClass('font-bold')
    expect(screen.getByText('Unknown')).toHaveClass('font-bold')
    expect(screen.getByText('Citadel of Ricks')).toHaveClass('font-bold')
    expect(screen.getByText('Earth (C-137)')).toHaveClass('font-bold')
    expect(screen.getByText('Alive')).toHaveClass('font-bold')
  })
})
