import { searchCharacterSchema } from './search-character-form'

describe('searchCharacterSchema', () => {
  it('should validate a valid character ID string', () => {
    const result = searchCharacterSchema.safeParse({ characterId: '1' })
    expect(result.success).toBe(true)
  })

  it('should validate a large valid character ID string', () => {
    const result = searchCharacterSchema.safeParse({ characterId: '123456' })
    expect(result.success).toBe(true)
  })

  it('should trim whitespace from character ID', () => {
    const result = searchCharacterSchema.safeParse({ characterId: '  42  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.characterId).toBe('42')
    }
  })

  it('should reject an empty string', () => {
    const result = searchCharacterSchema.safeParse({ characterId: '' })
    expect(result.success).toBe(false)
  })

  it('should reject non-numeric characters', () => {
    const result = searchCharacterSchema.safeParse({ characterId: 'abc' })
    expect(result.success).toBe(false)

    const result2 = searchCharacterSchema.safeParse({ characterId: '12a' })
    expect(result2.success).toBe(false)
  })

  it('should reject negative numbers', () => {
    const result = searchCharacterSchema.safeParse({ characterId: '-1' })
    expect(result.success).toBe(false)
  })

  it('should reject decimals', () => {
    const result = searchCharacterSchema.safeParse({ characterId: '1.5' })
    expect(result.success).toBe(false)
  })
})
