import { expect, test } from '@playwright/test'

const API_BASE = 'https://rickandmortyapi.com/api'

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
  type: '',
  status: 'Alive',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
}

test('fetches, caches, and reuses a character without another request', async ({ page }) => {
  let requestCount = 0

  await page.route(`${API_BASE}/character/130`, async (route) => {
    requestCount += 1

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(galacticPresidentResponse),
      status: 200,
    })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('130')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()

  await page.getByPlaceholder('Enter any number').fill('130')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(
    page.getByRole('button', { name: 'Show Galactic Federation President' }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect(requestCount).toBe(1)
})

test('restores cached characters after reload and clears them with Clear All', async ({ page }) => {
  await page.route(`${API_BASE}/character/130`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(galacticPresidentResponse),
      status: 200,
    })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('130')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()

  await page.reload()

  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()

  await page.getByRole('button', { name: 'Clear All' }).click()

  await expect(page.getByRole('img', { name: 'Character placeholder' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Show Galactic Federation President' }),
  ).toHaveCount(0)
})

test('shows "Character not found" error for a 404 response', async ({ page }) => {
  await page.route(`${API_BASE}/character/9999`, async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Character not found.' }),
    })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('9999')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(page.getByText('Character not found')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Character placeholder' })).toBeVisible()
})

test('shows a generic error message on server failure', async ({ page }) => {
  await page.route(`${API_BASE}/character/1`, async (route) => {
    await route.fulfill({ status: 500 })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('1')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(
    page.getByText('Something went wrong while fetching the character.'),
  ).toBeVisible()
})

test('removes an individual character from the cache rail', async ({ page }) => {
  await page.route(`${API_BASE}/character/130`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(galacticPresidentResponse),
      status: 200,
    })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('130')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(
    page.getByRole('button', { name: 'Show Galactic Federation President' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Remove Galactic Federation President' }).click()

  await expect(
    page.getByRole('button', { name: 'Show Galactic Federation President' }),
  ).toHaveCount(0)
  await expect(page.getByRole('img', { name: 'Character placeholder' })).toBeVisible()
})

test('switches the visible character by selecting from the cache rail', async ({ page }) => {
  await page.route(`${API_BASE}/character/130`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(galacticPresidentResponse),
      status: 200,
    })
  })

  await page.route(`${API_BASE}/character/1`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(rickSanchezResponse),
      status: 200,
    })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('130')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()

  await page.getByPlaceholder('Enter any number').fill('1')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('heading', { name: 'Rick Sanchez' })).toBeVisible()

  await page.getByRole('button', { name: 'Show Galactic Federation President' }).click()

  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Show Galactic Federation President' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: 'Show Rick Sanchez' }),
  ).toHaveAttribute('aria-pressed', 'false')
})

test('previews a cached character by typing its id without submitting', async ({ page }) => {
  await page.route(`${API_BASE}/character/130`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(galacticPresidentResponse),
      status: 200,
    })
  })

  await page.goto('/')

  await page.getByPlaceholder('Enter any number').fill('130')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()

  await page.getByPlaceholder('Enter any number').clear()
  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeHidden()

  await page.getByPlaceholder('Enter any number').fill('130')

  await expect(page.getByRole('heading', { name: 'Galactic Federation President' })).toBeVisible()
})
