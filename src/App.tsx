import type { JSX } from 'react'

import { AppProviders } from '@/app/providers/app-providers'
import { HomePage } from '@/pages/home/ui/home-page'

function App(): JSX.Element {
  return (
    <AppProviders>
      <HomePage />
    </AppProviders>
  )
}

export default App
