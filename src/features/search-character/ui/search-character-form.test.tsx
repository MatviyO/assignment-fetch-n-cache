import { render, screen } from '@testing-library/react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import { SearchCharacterForm } from '@/features/search-character/ui/search-character-form'

function createCharacterIdField(): UseFormRegisterReturn<'characterId'> {
  return {
    name: 'characterId',
    onBlur: async () => undefined,
    onChange: async () => undefined,
    ref: () => undefined,
  }
}

describe('SearchCharacterForm', () => {
  test('renders a shared underline with larger editorial search typography', () => {
    render(
      <SearchCharacterForm
        characterIdField={createCharacterIdField()}
        isLoading={false}
        onSubmit={() => undefined}
      />,
    )

    const form = screen.getByLabelText(/character search form/i)
    const input = screen.getByPlaceholderText(/enter any number/i)
    const button = screen.getByRole('button', { name: /search/i })

    expect(form).toHaveClass('border-b')
    expect(form).toHaveClass('border-slate-950')
    expect(input).toHaveClass('text-[28px]')
    expect(input).toHaveClass('placeholder:text-[18px]')
    expect(input).toHaveClass('placeholder:font-normal')
    expect(input).toHaveClass('placeholder:not-italic')
    expect(input.className).not.toContain('placeholder:[font-family:PTSans]')
    expect(input.className).not.toContain('border-b')
    expect(button).toHaveClass('text-[18px]')
  })

  test('disables the search action and softens the underline while loading', () => {
    render(
      <SearchCharacterForm
        characterIdField={createCharacterIdField()}
        isLoading={true}
        onSubmit={() => undefined}
      />,
    )

    const form = screen.getByLabelText(/character search form/i)
    const input = screen.getByPlaceholderText(/enter any number/i)
    const button = screen.getByRole('button', { name: /search/i })

    expect(form).toHaveClass('border-slate-300')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:text-slate-950')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:text-slate-300')
  })
})
