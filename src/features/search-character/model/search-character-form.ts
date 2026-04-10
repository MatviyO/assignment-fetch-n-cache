import { z } from 'zod'

interface SearchCharacterFormValues {
  characterId: string
}

const searchCharacterSchema = z.object({
  characterId: z.string().trim().min(1).regex(/^\d+$/),
})

export type { SearchCharacterFormValues }
export { searchCharacterSchema }
