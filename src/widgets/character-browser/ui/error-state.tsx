import type { JSX } from 'react'

interface ErrorStateProps {
  errorMessage: string
}

function ErrorState({ errorMessage }: ErrorStateProps): JSX.Element {
  return (
    <div className="flex min-h-[220px] items-center justify-center lg:min-h-[300px]">
      <p className="text-3xl font-semibold tracking-[-0.03em] text-red-600 lg:text-[34px]">
        {errorMessage}
      </p>
    </div>
  )
}

export { ErrorState }
