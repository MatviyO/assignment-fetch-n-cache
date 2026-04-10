import { cn } from './cn'

describe('cn utility', () => {
  it('should merge classes correctly', () => {
    expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500')
  })

  it('should handle conditional classes', () => {
    expect(cn('p-4', true && 'bg-red-500', false && 'text-white')).toBe('p-4 bg-red-500')
  })

  it('should handle tailwind class conflicts correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('p-4', 'pt-2')).toBe('p-4 pt-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle undefined and null inputs', () => {
    expect(cn('p-4', undefined, null)).toBe('p-4')
  })
})
