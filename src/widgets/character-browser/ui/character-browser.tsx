import type { JSX } from 'react'

import { CharacterPoster } from '@/entities/character/ui/character-poster'
import { CharacterCacheRail } from '@/features/character-cache/ui/character-cache-rail'
import { SearchCharacterForm } from '@/features/search-character/ui/search-character-form'
import { strings } from '@/shared/i18n/strings'
import { useCharacterBrowser } from '@/widgets/character-browser/model/use-character-browser'
import { CharacterBrowserContent } from '@/widgets/character-browser/ui/character-browser-content'

function CharacterBrowser(): JSX.Element {
  const {
    cacheRailCharacters,
    characterIdField,
    clearCache,
    errorMessage,
    isLoading,
    removeCharacter,
    screenState,
    selectCharacter,
    submitCharacterSearch,
    visibleCharacter,
    visibleCharacterId,
  } = useCharacterBrowser()
  const hasCachedCharacters = cacheRailCharacters.length > 0

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1024px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
      <section className="bg-white px-5 py-5 sm:px-7 sm:py-7 lg:h-[454px] lg:px-9 lg:py-8">
        <div className="mb-[30px] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SearchCharacterForm
            characterIdField={characterIdField}
            isLoading={isLoading}
            onSubmit={submitCharacterSearch}
          />

          {hasCachedCharacters ? (
            <button
              type="button"
              onClick={clearCache}
              className="self-end border-0 bg-transparent p-0 text-[15px] italic text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:text-blue-900 lg:self-auto"
            >
              {strings.clearAll}
            </button>
          ) : null}
        </div>

        <div className="grid gap-y-8 lg:grid-cols-[224px_minmax(0,1fr)_96px] lg:items-start lg:gap-x-8">
          <CharacterPoster character={visibleCharacter} isLoading={isLoading} />

          <div className="self-center">
            <CharacterBrowserContent
              errorMessage={errorMessage}
              screenState={screenState}
              visibleCharacter={visibleCharacter}
            />
          </div>

          <div className="flex flex-col items-center justify-start gap-4 sm:flex-row sm:items-center sm:justify-center lg:flex-col lg:items-end lg:justify-start">
            <CharacterCacheRail
              characters={cacheRailCharacters}
              selectedCharacterId={visibleCharacterId}
              onRemove={removeCharacter}
              onSelect={selectCharacter}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export { CharacterBrowser }
