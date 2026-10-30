import type { ProgressInferenceInput } from '@/features/progress/inference-types'

/** Synthetic scenario: these IDs and stages do not describe any real game achievements. */
export const progressInferenceDemo: ProgressInferenceInput = {
  gameId: 'fictional-game',
  chapterCount: 4,
  progression: 'linear',
  mode: 'demo',
  currentPlaythroughId: 'demo-run-1',
  asOf: 3_000,
  milestones: [
    {
      gameId: 'fictional-game',
      achievementId: 'fictional-start',
      chapterIndex: 0,
      provenance: 'demo',
    },
    {
      gameId: 'fictional-game',
      achievementId: 'fictional-midpoint',
      chapterIndex: 2,
      provenance: 'demo',
    },
  ],
  unlocks: [
    {
      gameId: 'fictional-game',
      achievementId: 'fictional-start',
      unlockedAt: 1_000,
      playthroughId: 'demo-run-1',
    },
    {
      gameId: 'fictional-game',
      achievementId: 'fictional-midpoint',
      unlockedAt: 2_000,
      playthroughId: 'demo-run-1',
    },
    {
      gameId: 'fictional-game',
      achievementId: 'fictional-collectibles',
      unlockedAt: 2_500,
      playthroughId: 'demo-run-1',
    },
  ],
}
