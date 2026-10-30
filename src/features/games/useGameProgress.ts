import { achievements } from '@/data/achievements'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'
import { getCompletion } from '@/features/progress/rules'

export function useGameProgress(gameId: string) {
  const { state } = usePlayerProgress()
  const items = achievements.filter((a) => a.gameId === gameId)
  const progress = state.progress[gameId]!
  const completed = progress.completedIds.length
  return {
    items,
    progress,
    completed,
    total: items.length,
    remaining: items.length - completed,
    percent: getCompletion(items.length, completed),
  }
}
