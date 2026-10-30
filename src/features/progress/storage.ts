import { achievements } from '@/data/achievements'
import { games } from '@/data/games'
import type { PlayerProgress, SpoilerLevel } from '@/types'

export const STORAGE_KEY = 'missable:v1'
export interface SavedState {
  version: 1
  spoilerLevel: SpoilerLevel
  progress: Record<string, PlayerProgress>
}
export function createInitialState(): SavedState {
  return {
    version: 1,
    spoilerLevel: 1,
    progress: Object.fromEntries(
      games.map((game) => [
        game.id,
        {
          gameId: game.id,
          chapter: game.id === 'persona-3' ? 1 : 0,
          completedIds: achievements
            .filter((a) => a.gameId === game.id && a.initiallyCompleted)
            .map((a) => a.id),
        },
      ]),
    ),
  }
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
export function parseSavedState(raw: string): SavedState {
  const parsed: unknown = JSON.parse(raw)
  if (
    !isRecord(parsed) ||
    parsed.version !== 1 ||
    ![1, 2, 3].includes(Number(parsed.spoilerLevel)) ||
    typeof parsed.spoilerLevel !== 'number' ||
    !isRecord(parsed.progress)
  )
    throw new Error('Invalid stored state')
  const result = createInitialState()
  result.spoilerLevel = parsed.spoilerLevel as SpoilerLevel
  for (const game of games) {
    const entry = parsed.progress[game.id]
    if (
      !isRecord(entry) ||
      entry.gameId !== game.id ||
      !Number.isInteger(entry.chapter) ||
      typeof entry.chapter !== 'number' ||
      entry.chapter < 0 ||
      entry.chapter >= game.chapters.length ||
      !Array.isArray(entry.completedIds) ||
      !entry.completedIds.every((id) => typeof id === 'string')
    )
      throw new Error('Invalid player progress')
    const allowed = new Set(achievements.filter((a) => a.gameId === game.id).map((a) => a.id))
    result.progress[game.id] = {
      gameId: game.id,
      chapter: entry.chapter,
      completedIds: [...new Set(entry.completedIds.filter((id) => allowed.has(id)))],
    }
  }
  return result
}
