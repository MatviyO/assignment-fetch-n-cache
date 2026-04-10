const rickAndMortyApiBaseUrl = import.meta.env.VITE_RICK_AND_MORTY_API_BASE_URL

if (!rickAndMortyApiBaseUrl) {
  throw new Error('VITE_RICK_AND_MORTY_API_BASE_URL is not defined')
}

export const env = {
  rickAndMortyApiBaseUrl,
} as const
