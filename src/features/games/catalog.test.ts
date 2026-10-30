import { describe, expect, it } from 'vitest'
import { games } from '@/data/games'
import { filterCatalog } from './catalog'
const percents: Record<string, number> = {
  'persona-3': 60,
  'hollow-knight': 35,
  'elden-ring': 25,
  hades: 75,
  cyberpunk: 0,
  stardew: 100,
}
const getPercent = (id: string) => percents[id] ?? 0
describe('library search and filters', () => {
  it('combines normalized search with progress filters', () => {
    expect(
      filterCatalog(games, '  PERSONA ', 'playing', 'recent', getPercent).map((g) => g.id),
    ).toEqual(['persona-3'])
    expect(filterCatalog(games, 'persona', 'complete', 'recent', getPercent)).toEqual([])
  })
  it('isolates completed and unstarted games', () => {
    expect(filterCatalog(games, '', 'complete', 'recent', getPercent).map((g) => g.id)).toEqual([
      'stardew',
    ])
    expect(filterCatalog(games, '', 'not-started', 'recent', getPercent).map((g) => g.id)).toEqual([
      'cyberpunk',
    ])
  })
  it('sorts without mutating the source catalog', () => {
    expect(filterCatalog(games, '', 'all', 'progress', getPercent)[0]!.id).toBe('stardew')
    expect(games[0]!.id).toBe('persona-3')
    expect(filterCatalog(games, '', 'all', 'name', getPercent)[0]!.id).toBe('cyberpunk')
  })
})
