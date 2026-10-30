import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/achievements'
import { evaluateObjective, getCompletion } from './rules'
import type { PlayerProgress } from '@/types'

const achievement = achievements[0]!
const progress: PlayerProgress = { gameId: achievement.gameId, chapter: 0, completedIds: [] }
describe('fictional narrative rules', () => {
  it('moves from available to expiring at the boundary, then expired', () => {
    expect(evaluateObjective(achievement, progress).status).toBe('available')
    expect(evaluateObjective(achievement, { ...progress, chapter: 1 }).status).toBe('expiring')
    expect(evaluateObjective(achievement, { ...progress, chapter: 2 }).status).toBe('expired')
  })
  it('keeps completion authoritative even after the fictional window closes', () => {
    expect(
      evaluateObjective(achievement, { ...progress, chapter: 3, completedIds: [achievement.id] })
        .status,
    ).toBe('completed')
  })
  it('distinguishes upcoming from unknown without guessing a rule', () => {
    expect(evaluateObjective(achievements[4]!, progress).status).toBe('upcoming')
    expect(evaluateObjective(achievements[2]!, progress).status).toBe('unknown')
  })
  it('handles an empty catalog without dividing by zero', () => {
    expect(getCompletion(0, 0)).toBe(0)
    expect(getCompletion(40, 24)).toBe(60)
  })
})
