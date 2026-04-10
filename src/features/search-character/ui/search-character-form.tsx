import type { FormEventHandler, JSX } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface SearchCharacterFormProps {
  characterIdField: UseFormRegisterReturn<'characterId'>
  isLoading: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
}

function SearchCharacterForm({
  characterIdField,
  isLoading,
  onSubmit,
}: SearchCharacterFormProps): JSX.Element {
  const formBorderClassName = isLoading ? 'border-slate-300' : 'border-slate-950'

  return (
    <form
      className={`flex w-full max-w-[392px] items-end gap-4 border-b pb-1 ${formBorderClassName}`}
      aria-label="Character search form"
      onSubmit={onSubmit}
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">Character ID</span>
        <input
          className="w-full border-0 bg-transparent px-0 py-0 text-[28px] leading-none italic text-slate-950 outline-none placeholder:text-[18px] placeholder:font-normal placeholder:not-italic placeholder:text-slate-400 focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-950 disabled:opacity-100"
          placeholder="Enter any number"
          inputMode="numeric"
          autoComplete="off"
          disabled={isLoading}
          {...characterIdField}
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="shrink-0 border-0 bg-transparent p-0 text-[18px] leading-none italic text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        Search
      </button>
    </form>
  )
}

export { SearchCharacterForm }
