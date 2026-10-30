export type SpoilerLevel = 1 | 2 | 3
export type AchievementCategory =
  'normal' | 'missable' | 'story' | 'ng-plus' | 'multiplayer' | 'dlc' | 'secret'
export interface Game {
  id: string
  title: string
  genre: string
  cover: string
  hero: string
  hasGuide: boolean
  lastPlayed: number
  chapters: readonly string[]
  verifiedCompletionHours?: number
  verifiedPlaythroughs?: number
  isDemo: true
}
export interface Achievement {
  id: string
  gameId: string
  title: string
  safeTitle: string
  categories: AchievementCategory[]
  safeDescription: string
  hint: string
  instructions: string
  availableFrom?: number
  expiresAt?: number
  initiallyCompleted: boolean
  isDemo: true
}
export interface PlayerProgress {
  gameId: string
  chapter: number
  completedIds: string[]
}
export type ObjectiveStatus =
  'available' | 'expiring' | 'completed' | 'unknown' | 'expired' | 'upcoming'
export interface AchievementWarning {
  achievementId: string
  status: ObjectiveStatus
  safeMessage: string
  isDemo: true
}
