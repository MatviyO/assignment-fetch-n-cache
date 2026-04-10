import type { JSX } from 'react'
import { CharacterJsonLd } from '@/entities/character/ui/character-json-ld'
import { CharacterPoster } from '@/entities/character/ui/character-poster'
import { CharacterCacheRail } from '@/features/character-cache/ui/character-cache-rail'
import { SearchCharacterForm } from '@/features/search-character/ui/search-character-form'
import { strings } from '@/shared/i18n/strings'
import { VisuallyHidden } from '@/shared/ui/visually-hidden'
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
    <main className="mx-auto min-h-screen w-full max-w-[1024px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <VisuallyHidden as="h1">Rick and Morty Character Browser - Fetch 'n' Cache</VisuallyHidden>

      {visibleCharacter && <CharacterJsonLd character={visibleCharacter} />}

      <section className="bg-white px-4 py-4 sm:px-6 sm:py-6 lg:h-[454px] lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-[30px]">
          <div className="flex-1">
            <SearchCharacterForm
              characterIdField={characterIdField}
              isLoading={isLoading}
              onSubmit={submitCharacterSearch}
            />
          </div>

          {hasCachedCharacters ? (
            <button
              type="button"
              onClick={clearCache}
              className="hidden px-0 py-1 text-[15px] italic text-brand-blue transition hover:opacity-80 focus:outline-none lg:inline lg:self-auto"
            >
              {strings.clearAll}
            </button>
          ) : null}
        </div>

        <div className="grid gap-y-8 lg:grid-cols-[224px_minmax(0,1fr)_96px] lg:items-start lg:gap-x-8">
          <div className="flex justify-center lg:block">
            <CharacterPoster character={visibleCharacter} isLoading={isLoading} />
          </div>

          <div className="flex flex-col justify-center lg:block">
            <CharacterBrowserContent
              errorMessage={errorMessage}
              screenState={screenState}
              visibleCharacter={visibleCharacter}
            />
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end lg:justify-start">
            <div className="flex w-full justify-start lg:justify-end">
              <CharacterCacheRail
                characters={cacheRailCharacters}
                selectedCharacterId={visibleCharacterId}
                onRemove={removeCharacter}
                onSelect={selectCharacter}
              />
            </div>

            {hasCachedCharacters ? (
              <button
                type="button"
                onClick={clearCache}
                className="text-[13px] italic text-brand-blue transition hover:opacity-80 focus:outline-none lg:hidden"
              >
                {strings.clearAll}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}

export { CharacterBrowser }
