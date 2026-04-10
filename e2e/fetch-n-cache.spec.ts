import { expect, test } from '@playwright/test'

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

test('fetches, caches, and reuses a character without another request', async ({ page }) => {
  let requestCount = 0

  await page.route('https://rickandmortyapi.com/api/character/130', async (route) => {
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
  await page.route('https://rickandmortyapi.com/api/character/130', async (route) => {
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
