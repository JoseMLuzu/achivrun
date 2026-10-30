import type { Game } from '@/types'
export type ProgressFilter = 'all' | 'playing' | 'complete' | 'not-started'
export type SortOrder = 'recent' | 'name' | 'progress'
export function filterCatalog(
  games: Game[],
  query: string,
  filter: ProgressFilter,
  order: SortOrder,
  getPercent: (gameId: string) => number,
) {
  return games
    .filter((game) => {
      const percent = getPercent(game.id)
      return (
        game.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
        (filter === 'all' ||
          (filter === 'playing' && percent > 0 && percent < 100) ||
          (filter === 'complete' && percent === 100) ||
          (filter === 'not-started' && percent === 0))
      )
    })
    .sort((a, b) =>
      order === 'name'
        ? a.title.localeCompare(b.title)
        : order === 'progress'
          ? getPercent(b.id) - getPercent(a.id)
          : b.lastPlayed - a.lastPlayed,
    )
}
