import type { JSX } from 'react'

import type { Character } from '@/entities/character/model/types'

interface CharacterJsonLdProps {
  character: Character
}

/**
 * Renders JSON-LD structured data for a character to improve SEO by providing
 * search engines with structured information about the character entity.
 */
function CharacterJsonLd({ character }: CharacterJsonLdProps): JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: character.name,
    image: character.image,
    description: `${character.name} is a ${character.species} character from Rick and Morty. Current status: ${character.status}.`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rickandmortyapi.com/api/character/${character.id}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify output is XSS-safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export { CharacterJsonLd }
