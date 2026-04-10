import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '@/App'
import { characterCacheStore } from '@/entities/character/model/cache-store'

const galacticPresidentResponse = {
  id: 130,
  name: 'Galactic Federation President',
  image: 'https://rickandmortyapi.com/api/character/avatar/130.jpeg',
  species: 'Alien',
  type: 'Gromflomite',
  status: 'Dead',
  origin: {
    name: 'Unknown',
  },
  location: {
    name: 'Unknown',
  },
}

const rickSanchezResponse = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  species: 'Human',
  type: 'Unknown',
  status: 'Alive',
  origin: {
    name: 'Earth (C-137)',
  },
  location: {
    name: 'Citadel of Ricks',
  },
}

const createCachedCharacter = (id: number, name: string) => ({
  id,
  name,
  image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
  species: 'Alien',
  type: 'Unknown',
  status: 'Alive' as const,
  origin: `Origin ${id}`,
  location: `Location ${id}`,
})

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    characterCacheStore.getState().clearCache()
  })

  test('renders the desktop canvas as a flat white 1024-wide shell without radius', () => {
    render(<App />)

    const main = screen.getByRole('main')
    const screenSection = main.querySelector('section')

    expect(main).toHaveClass('max-w-[1024px]')
    expect(screenSection).toHaveClass('bg-white')
    expect(screenSection).toHaveClass('lg:h-[454px]')
    expect(screen.getByPlaceholderText(/enter any number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeEnabled()
    expect(screen.getByRole('img', { name: /character placeholder/i })).toBeInTheDocument()
    expect(screen.queryByText(/start screen/i)).not.toBeInTheDocument()
    expect(screen.queryByText('1024 0454')).not.toBeInTheDocument()
    expect(screenSection?.className).not.toContain('border ')
    expect(screenSection?.className).not.toContain('rounded')
  })

  test('uses the PNG placeholder image before a character is selected', () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /character placeholder/i })).toHaveAttribute(
      'src',
      '/character-placeholder.png',
    )
  })

  test('keeps the character card at 224 by 224 across placeholder, loading, and active states', async () => {
    let resolveRequest: (() => void) | undefined
    const originalFetch = global.fetch
    const fetchMock = jest.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = () => {
            resolve({
              ok: true,
              json: () => Promise.resolve(galacticPresidentResponse),
            } as Response)
          }
        }),
    )

    global.fetch = fetchMock as typeof fetch

    const user = userEvent.setup()
    render(<App />)

    const expectCardToBeSquare = () => {
      const posterCard = screen.getByLabelText(/character card/i)

      expect(posterCard).toHaveClass('w-[224px]')
      expect(posterCard).toHaveClass('h-[224px]')
    }

    expectCardToBeSquare()

    await user.type(screen.getByPlaceholderText(/enter any number/i), '130')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expectCardToBeSquare()

    if (!resolveRequest) {
      throw new Error('Expected request resolver to be assigned')
    }

    resolveRequest()

    await screen.findByRole('heading', {
      name: /galactic federation president/i,
    })

    expectCardToBeSquare()

    global.fetch = originalFetch
  })

  test('shows only the three most recent cached characters in the rail', () => {
    characterCacheStore.getState().upsertCharacter(createCachedCharacter(1, 'Rick Sanchez'))
    characterCacheStore.getState().upsertCharacter(createCachedCharacter(2, 'Morty Smith'))
    characterCacheStore.getState().upsertCharacter(createCachedCharacter(3, 'Summer Smith'))
    characterCacheStore.getState().upsertCharacter(createCachedCharacter(4, 'Beth Smith'))

    render(<App />)

    const cacheRail = screen.getByLabelText(/cached characters/i)
    const cacheRailContainer = cacheRail.parentElement

    expect(screen.getAllByRole('button', { name: /show /i })).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /show rick sanchez/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show beth smith/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show beth smith/i })).toHaveClass('size-[60px]')
    expect(cacheRailContainer).toHaveClass('sm:items-center')
    expect(cacheRailContainer).toHaveClass('lg:items-center')
    expect(cacheRailContainer).toHaveClass('lg:justify-start')
    expect(cacheRailContainer?.className).not.toContain('lg:justify-center')
    expect(cacheRailContainer?.className).not.toContain('min-h')
    expect(cacheRail.className).not.toContain('overflow-x-auto')
    expect(cacheRail.className).not.toContain('overflow-y-auto')
    expect(cacheRail.className).not.toContain('max-h')
    expect(cacheRail.className).not.toContain('max-w')
  })

  test('renders the loading spinner inside the poster card while the request is in flight', async () => {
    let resolveRequest: (() => void) | undefined
    const originalFetch = global.fetch
    const fetchMock = jest.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = () => {
            resolve({
              ok: true,
              json: () => Promise.resolve(galacticPresidentResponse),
            } as Response)
          }
        }),
    )

    global.fetch = fetchMock as typeof fetch

    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/enter any number/i)
    const button = screen.getByRole('button', { name: /search/i })

    await user.type(input, '130')
    await user.click(button)

    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
    expect(screen.queryByRole('img', { name: /character placeholder/i })).not.toBeInTheDocument()

    const posterCard = screen.getByLabelText(/character card/i)

    expect(within(posterCard).getByRole('status')).toBeInTheDocument()

    if (!resolveRequest) {
      throw new Error('Expected request resolver to be assigned')
    }

    resolveRequest()

    expect(
      await screen.findByRole('heading', {
        name: /galactic federation president/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Alien')).toBeInTheDocument()
    global.fetch = originalFetch
  })

  test('shows fetched characters in the cache sidebar and marks the current one as selected', async () => {
    const originalFetch = global.fetch
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(galacticPresidentResponse),
      } as Response),
    ) as unknown as typeof fetch

    global.fetch = fetchMock

    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/enter any number/i), '130')
    await user.click(screen.getByRole('button', { name: /search/i }))

    const cachedCharacterButton = await screen.findByRole('button', {
      name: /show galactic federation president/i,
    })

    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument()
    expect(cachedCharacterButton).toHaveAttribute('aria-pressed', 'true')

    global.fetch = originalFetch
  })

  test('removes a cached character from the sidebar with the remove button', async () => {
    const originalFetch = global.fetch
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(galacticPresidentResponse),
      } as Response),
    ) as unknown as typeof fetch

    global.fetch = fetchMock

    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/enter any number/i), '130')
    await user.click(screen.getByRole('button', { name: /search/i }))

    const removeButton = await screen.findByRole('button', {
      name: /remove galactic federation president/i,
    })

    await user.click(removeButton)

    expect(
      screen.queryByRole('button', { name: /show galactic federation president/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: /character placeholder/i })).toBeInTheDocument()

    global.fetch = originalFetch
  })

  test('instantly previews a cached character when its id is typed into the input', async () => {
    const originalFetch = global.fetch
    const fetchMock = jest.fn((input: string | URL | Request) => {
      const requestUrl =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

      if (requestUrl.endsWith('/130')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(galacticPresidentResponse),
        } as Response)
      }

      if (requestUrl.endsWith('/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(rickSanchezResponse),
        } as Response)
      }

      throw new Error(`Unexpected URL: ${requestUrl}`)
    }) as unknown as typeof fetch

    global.fetch = fetchMock

    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/enter any number/i)

    await user.type(input, '130')
    await user.click(screen.getByRole('button', { name: /search/i }))
    await screen.findByRole('heading', {
      name: /galactic federation president/i,
    })

    await user.clear(input)
    await user.type(input, '1')
    await user.click(screen.getByRole('button', { name: /search/i }))
    await screen.findByRole('heading', { name: /rick sanchez/i })

    await user.clear(input)
    await user.type(input, '130')

    expect(
      await screen.findByRole('heading', {
        name: /galactic federation president/i,
      }),
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    global.fetch = originalFetch
  })

  test('restores cached characters after remounting the app', async () => {
    const originalFetch = global.fetch
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(galacticPresidentResponse),
      } as Response),
    ) as unknown as typeof fetch

    global.fetch = fetchMock

    const user = userEvent.setup()
    const firstRender = render(<App />)

    await user.type(
      screen.getByPlaceholderText(/enter any number/i),
      galacticPresidentResponse.id.toString(),
    )
    await user.click(screen.getByRole('button', { name: /search/i }))
    await screen.findByRole('heading', {
      name: /galactic federation president/i,
    })

    firstRender.unmount()
    characterCacheStore.getState().clearCache()

    render(<App />)

    expect(
      await screen.findByRole('heading', {
        name: /galactic federation president/i,
      }),
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    global.fetch = originalFetch
  })

  test('reuses a cached character on repeat search without another network request', async () => {
    const originalFetch = global.fetch
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(galacticPresidentResponse),
      } as Response),
    ) as unknown as typeof fetch

    global.fetch = fetchMock

    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText(/enter any number/i)

    await user.type(input, '130')
    await user.click(screen.getByRole('button', { name: /search/i }))
    await screen.findByRole('heading', {
      name: /galactic federation president/i,
    })

    await user.clear(input)
    await user.type(input, '130')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(fetchMock).toHaveBeenCalledTimes(1)

    global.fetch = originalFetch
  })

  test('shows a not found error when the API returns 404', async () => {
    const originalFetch = global.fetch
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Character not found' }),
      } as Response),
    ) as unknown as typeof fetch

    global.fetch = fetchMock

    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/enter any number/i), '1067')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(await screen.findByText(/character not found/i)).toBeInTheDocument()

    global.fetch = originalFetch
  })
})
