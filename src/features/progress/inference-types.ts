/** Timestamps use Unix milliseconds. A playthrough is assigned explicitly, never guessed. */
export interface AchievementUnlock {
  gameId: string
  achievementId: string
  unlockedAt: number
  playthroughId?: string
}

/** A curated mapping; achievement category alone is not evidence of narrative position. */
export interface NarrativeMilestone {
  gameId: string
  achievementId: string
  chapterIndex: number
  provenance: 'verified' | 'demo'
}

export interface ProgressInferenceInput {
  gameId: string
  chapterCount: number
  progression: 'linear' | 'nonlinear'
  mode: 'verified' | 'demo'
  unlocks: readonly AchievementUnlock[]
  milestones: readonly NarrativeMilestone[]
  asOf: number
  currentPlaythroughId?: string
}

export type ProgressInference = {
  scope: 'current-playthrough' | 'account-history'
  isDemo: boolean
  requiresConfirmation: true
} & (
  | {
      status: 'unknown'
      reason: 'invalid-context' | 'nonlinear-progression' | 'no-narrative-evidence'
      evidenceConfidence: 'none'
    }
  | {
      status: 'lower-bound'
      /** Evidence that this stage was reached, not proof of the current save's location. */
      atLeastChapterIndex: number
      evidenceAchievementId: string
      evidenceUnlockedAt: number
      evidenceConfidence: 'high' | 'medium'
      reason: 'latest-is-milestone' | 'earlier-milestone' | 'historical-evidence'
    }
)
