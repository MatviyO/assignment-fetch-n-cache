import '@testing-library/jest-dom'

jest.mock('@/shared/config/env', () => ({
  env: {
    rickAndMortyApiBaseUrl: 'https://rickandmortyapi.com/api',
  },
}))
