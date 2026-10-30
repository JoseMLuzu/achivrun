import type { Achievement, AchievementWarning, PlayerProgress } from '@/types'

/** Demo evaluator: replace with a backend rule adapter when verified rules exist. */
export function evaluateObjective(
  achievement: Achievement,
  progress: PlayerProgress,
): AchievementWarning {
  const base = { achievementId: achievement.id, isDemo: true as const }
  if (progress.completedIds.includes(achievement.id))
    return { ...base, status: 'completed', safeMessage: 'Completado manualmente' }
  if (achievement.availableFrom === undefined)
    return { ...base, status: 'unknown', safeMessage: 'Sin información suficiente' }
  if (progress.chapter < achievement.availableFrom)
    return { ...base, status: 'upcoming', safeMessage: 'Disponible más adelante' }
  if (achievement.expiresAt !== undefined) {
    if (progress.chapter >= achievement.expiresAt)
      return { ...base, status: 'expired', safeMessage: 'Ventana de ejemplo cerrada' }
    if (progress.chapter === achievement.expiresAt - 1)
      return { ...base, status: 'expiring', safeMessage: 'Revísalo antes de avanzar' }
  }
  return { ...base, status: 'available', safeMessage: 'Disponible en tu etapa' }
}
export function getCompletion(total: number, completed: number) {
  return total ? Math.round((completed / total) * 100) : 0
}
