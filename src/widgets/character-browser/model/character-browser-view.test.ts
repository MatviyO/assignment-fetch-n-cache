import {
  getCharacterBrowserScreenState,
  selectCacheRailCharacterIds,
  selectVisibleCharacter,
} from '@/widgets/character-browser/model/character-browser-view'

const createCharacter = (id: number, name: string) => ({
  id,
  name,
  image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
  species: 'Human',
  type: 'Unknown',
  status: 'Alive' as const,
  origin: `Origin ${id}`,
  location: `Location ${id}`,
})

describe('character-browser-view', () => {
  test('selectVisibleCharacter returns the selected cached character', () => {
    const visibleCharacter = selectVisibleCharacter(
      {
        1: {
          character: createCharacter(1, 'Rick Sanchez'),
          cachedAt: 1_000,
        },
      },
      1,
    )

    expect(visibleCharacter?.name).toBe('Rick Sanchez')
  })

  test('selectVisibleCharacter returns null when nothing is selected', () => {
    const visibleCharacter = selectVisibleCharacter({}, null)

    expect(visibleCharacter).toBeNull()
  })

  test('selectCacheRailCharacterIds reverses cache order for the sidebar', () => {
    expect(selectCacheRailCharacterIds([1, 2, 3])).toEqual([3, 2, 1])
  })

  test('getCharacterBrowserScreenState returns loading before other states', () => {
    const screenState = getCharacterBrowserScreenState({
      isLoading: true,
      errorMessage: 'Character not found',
      visibleCharacter: createCharacter(1, 'Rick Sanchez'),
    })

    expect(screenState).toBe('loading')
  })

  test('getCharacterBrowserScreenState returns error when loading is idle and an error exists', () => {
    const screenState = getCharacterBrowserScreenState({
      isLoading: false,
      errorMessage: 'Character not found',
      visibleCharacter: null,
    })

    expect(screenState).toBe('error')
  })

  test('getCharacterBrowserScreenState returns ready when a visible character exists', () => {
    const screenState = getCharacterBrowserScreenState({
      isLoading: false,
      errorMessage: null,
      visibleCharacter: createCharacter(130, 'Galactic Federation President'),
    })

    expect(screenState).toBe('ready')
  })

  test('getCharacterBrowserScreenState returns idle when no data is available', () => {
    const screenState = getCharacterBrowserScreenState({
      isLoading: false,
      errorMessage: null,
      visibleCharacter: null,
    })

    expect(screenState).toBe('idle')
  })
})
