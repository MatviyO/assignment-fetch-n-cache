import { readFileSync } from 'node:fs'

describe('global styles', () => {
  test('declares PT Sans as the application font family', () => {
    const cssSource = readFileSync('src/index.css', 'utf8')

    expect(cssSource).toContain('font-family: "PT Sans"')
  })
})
