import { describe, expect, it } from 'vitest'
import { achievements } from '@/data/achievements'
import { presentAchievement } from './presentation'

describe('progressive spoiler disclosure', () => {
  const secret = achievements[2]!
  it.each([1, 2] as const)(
    'conceals secret identity at level %s, including the search projection',
    (level) => {
      const view = presentAchievement(secret, level)
      expect(view.title).toBe('Logro secreto')
      expect(JSON.stringify(view)).not.toContain(secret.title)
      expect(view.instructions).toBeUndefined()
    },
  )
  it('does not expose hints in spoiler-free mode', () => {
    expect(presentAchievement(secret, 1).hint).toBeUndefined()
    expect(presentAchievement(secret, 2).hint).toBe(secret.hint)
  })
  it('makes full instructions available only after opting into level 3', () => {
    const view = presentAchievement(secret, 3)
    expect(view.title).toBe(secret.title)
    expect(view.instructions).toBe(secret.instructions)
  })
})
