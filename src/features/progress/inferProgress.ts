import type {
  NarrativeMilestone,
  ProgressInference,
  ProgressInferenceInput,
} from './inference-types'

/**
 * Deterministic estimate for a curated, linear narrative timeline.
 * Missing achievements never establish an upper bound. This does not update PlayerProgress.
 */
export function inferProgress(input: ProgressInferenceInput): ProgressInference {
  const playthroughId = input.currentPlaythroughId?.trim()
  const base = {
    scope: playthroughId ? ('current-playthrough' as const) : ('account-history' as const),
    isDemo: input.mode === 'demo',
    requiresConfirmation: true as const,
  }
  const unknown = (
    reason: Extract<ProgressInference, { status: 'unknown' }>['reason'],
  ): ProgressInference => ({ ...base, status: 'unknown', reason, evidenceConfidence: 'none' })

  if (
    !input.gameId ||
    !Number.isInteger(input.chapterCount) ||
    input.chapterCount < 1 ||
    !Number.isFinite(input.asOf) ||
    input.asOf <= 0
  )
    return unknown('invalid-context')
  if (input.progression !== 'linear') return unknown('nonlinear-progression')

  const milestones = new Map<string, NarrativeMilestone>()
  const ambiguousIds = new Set<string>()
  for (const milestone of input.milestones) {
    if (milestone.gameId !== input.gameId || milestone.provenance !== input.mode) continue
    if (
      !Number.isInteger(milestone.chapterIndex) ||
      milestone.chapterIndex < 0 ||
      milestone.chapterIndex >= input.chapterCount
    )
      continue
    const existing = milestones.get(milestone.achievementId)
    if (existing && existing.chapterIndex !== milestone.chapterIndex) {
      ambiguousIds.add(milestone.achievementId)
    }
    milestones.set(milestone.achievementId, milestone)
  }

  const unlocks = input.unlocks.filter(
    (unlock) =>
      unlock.gameId === input.gameId &&
      (!playthroughId || unlock.playthroughId === playthroughId) &&
      Number.isFinite(unlock.unlockedAt) &&
      unlock.unlockedAt > 0 &&
      unlock.unlockedAt <= input.asOf,
  )
  const latestTimestamp = unlocks.reduce((latest, unlock) => Math.max(latest, unlock.unlockedAt), 0)
  const latestIds = new Set(
    unlocks
      .filter((unlock) => unlock.unlockedAt === latestTimestamp)
      .map((unlock) => unlock.achievementId),
  )
  const evidence = unlocks
    .flatMap((unlock) => {
      const milestone = milestones.get(unlock.achievementId)
      return milestone && !ambiguousIds.has(unlock.achievementId) ? [{ unlock, milestone }] : []
    })
    .sort(
      (a, b) =>
        b.milestone.chapterIndex - a.milestone.chapterIndex ||
        b.unlock.unlockedAt - a.unlock.unlockedAt ||
        a.unlock.achievementId.localeCompare(b.unlock.achievementId),
    )[0]
  if (!evidence) return unknown('no-narrative-evidence')

  const isLatest = evidence.unlock.unlockedAt === latestTimestamp && latestIds.size === 1
  return {
    ...base,
    status: 'lower-bound',
    atLeastChapterIndex: evidence.milestone.chapterIndex,
    evidenceAchievementId: evidence.unlock.achievementId,
    evidenceUnlockedAt: evidence.unlock.unlockedAt,
    evidenceConfidence: playthroughId && isLatest ? 'high' : 'medium',
    reason: !playthroughId
      ? 'historical-evidence'
      : isLatest
        ? 'latest-is-milestone'
        : 'earlier-milestone',
  }
}
