import { describe, expect, it } from 'vitest'
import { progressInferenceDemo } from '@/data/progress-inference-demo'
import { inferProgress } from './inferProgress'
import type { ProgressInferenceInput } from './inference-types'

function fixture(): ProgressInferenceInput {
  return structuredClone(progressInferenceDemo)
}

describe('narrative progress inference', () => {
  it('uses the last meaningful milestone when the latest unlock is optional', () => {
    expect(inferProgress(fixture())).toMatchObject({
      status: 'lower-bound',
      atLeastChapterIndex: 2,
      evidenceConfidence: 'medium',
      reason: 'earlier-milestone',
      requiresConfirmation: true,
      isDemo: true,
    })
  })
  it('assigns high evidence confidence to a latest milestone scoped to the selected run', () => {
    const input = fixture()
    input.unlocks = input.unlocks.slice(0, 2)
    expect(inferProgress(input)).toMatchObject({
      status: 'lower-bound',
      atLeastChapterIndex: 2,
      evidenceConfidence: 'high',
      reason: 'latest-is-milestone',
    })
  })
  it('does not mistake account history for the current playthrough', () => {
    const input = fixture()
    delete input.currentPlaythroughId
    expect(inferProgress(input)).toMatchObject({
      scope: 'account-history',
      reason: 'historical-evidence',
      evidenceConfidence: 'medium',
      requiresConfirmation: true,
    })
  })
  it('excludes achievements from other games and playthroughs', () => {
    const input = fixture()
    input.unlocks = input.unlocks.map((unlock) => ({ ...unlock, playthroughId: 'older-run' }))
    expect(inferProgress(input)).toMatchObject({
      status: 'unknown',
      reason: 'no-narrative-evidence',
    })
    input.unlocks = fixture().unlocks.map((unlock) => ({ ...unlock, gameId: 'another-game' }))
    expect(inferProgress(input).status).toBe('unknown')
  })
  it('does not infer an upper bound from missing or out-of-order achievements', () => {
    const input = fixture()
    input.unlocks = [...input.unlocks, { ...input.unlocks[0]!, unlockedAt: 2_900 }]
    expect(inferProgress(input)).toMatchObject({
      status: 'lower-bound',
      atLeastChapterIndex: 2,
      evidenceConfidence: 'medium',
    })
  })
  it('returns unknown without mapped narrative evidence', () => {
    const input = fixture()
    input.unlocks = input.unlocks.slice(2)
    expect(inferProgress(input)).toMatchObject({ status: 'unknown', evidenceConfidence: 'none' })
    expect(inferProgress({ ...input, unlocks: [] }).status).toBe('unknown')
  })
  it('ignores invalid, missing and future timestamps', () => {
    for (const unlockedAt of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, 4_000]) {
      const input = fixture()
      input.unlocks = input.unlocks.map((unlock) => ({ ...unlock, unlockedAt }))
      expect(inferProgress(input).status).toBe('unknown')
    }
  })
  it('refuses to apply a linear estimate to branching progression', () => {
    expect(inferProgress({ ...fixture(), progression: 'nonlinear' })).toMatchObject({
      status: 'unknown',
      reason: 'nonlinear-progression',
    })
  })
  it('keeps synthetic mappings out of verified mode', () => {
    expect(inferProgress({ ...fixture(), mode: 'verified' })).toMatchObject({
      status: 'unknown',
      isDemo: false,
    })
  })
  it('ignores out-of-range mappings and conflicting mappings for the same achievement', () => {
    const input = fixture()
    const midpoint = input.milestones[1]!
    input.milestones = [{ ...midpoint, chapterIndex: 99 }]
    expect(inferProgress(input).status).toBe('unknown')
    input.milestones = [midpoint, { ...midpoint, chapterIndex: 1 }]
    expect(inferProgress(input).status).toBe('unknown')
  })
  it('does not overstate confidence when achievements share a batch timestamp', () => {
    const input = fixture()
    input.unlocks = input.unlocks.map((unlock) => ({ ...unlock, unlockedAt: 2_000 }))
    expect(inferProgress(input)).toMatchObject({ evidenceConfidence: 'medium' })
  })
  it('does not mutate input data or update manually selected progress', () => {
    const input = fixture()
    const before = structuredClone(input)
    inferProgress(input)
    expect(input).toEqual(before)
  })
  it.each([0, -1, 1.5, Number.NaN])('rejects invalid chapter count %s', (chapterCount) => {
    expect(inferProgress({ ...fixture(), chapterCount })).toMatchObject({
      status: 'unknown',
      reason: 'invalid-context',
    })
  })
})
