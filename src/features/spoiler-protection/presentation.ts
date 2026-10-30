import type { Achievement, SpoilerLevel } from '@/types'

// All consumers (including search) must use this projection instead of the raw title.
export function presentAchievement(achievement: Achievement, level: SpoilerLevel) {
  const protectedIdentity = achievement.categories.includes('secret') && level < 3
  return {
    title: protectedIdentity || level === 1 ? achievement.safeTitle : achievement.title,
    description: achievement.safeDescription,
    hint: level >= 2 ? achievement.hint : undefined,
    instructions: level === 3 ? achievement.instructions : undefined,
    protectedIdentity,
  }
}
