import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Library, X } from 'lucide-react'
import { games } from '@/data/games'
import { achievements } from '@/data/achievements'
import { PageHeading } from '@/components/PageHeading'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { GameCard } from '@/features/games/GameCard'
import { filterCatalog, type ProgressFilter, type SortOrder } from '@/features/games/catalog'
import { getCompletion } from '@/features/progress/rules'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'

const filters: { id: ProgressFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'playing', label: 'En progreso' },
  { id: 'complete', label: 'Completados' },
  { id: 'not-started', label: 'Sin empezar' },
]
export function LibraryPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ProgressFilter>('all')
  const [order, setOrder] = useState<SortOrder>('recent')
  const { state } = usePlayerProgress()
  const results = useMemo(
    () =>
      filterCatalog(games, query, filter, order, (id) =>
        getCompletion(
          achievements.filter((a) => a.gameId === id).length,
          state.progress[id]!.completedIds.length,
        ),
      ),
    [query, filter, order, state.progress],
  )
  const reset = () => {
    setQuery('')
    setFilter('all')
    setOrder('recent')
  }
  return (
    <>
      <PageHeading
        eyebrow="CADA JUEGO, UNA HISTORIA"
        title="Tu biblioteca."
        description="Aventuras pendientes. Mundos por explorar. Logros por descubrir."
        action={
          <span className="library-total">
            <Library size={17} /> {games.length} juegos de ejemplo
          </span>
        }
      />
      <div className="library-toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Buscar videojuegos"
            placeholder="Busca tu próxima aventura…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Borrar búsqueda"
              onClick={() => setQuery('')}
            >
              <X size={15} />
            </Button>
          )}
        </div>
        <div className="sort-field">
          <SlidersHorizontal size={15} />
          <label htmlFor="game-sort" className="sr-only">
            Ordenar juegos
          </label>
          <select
            id="game-sort"
            value={order}
            onChange={(event) => setOrder(event.target.value as SortOrder)}
          >
            <option value="recent">Actividad reciente</option>
            <option value="name">Nombre: A–Z</option>
            <option value="progress">Mayor progreso</option>
          </select>
        </div>
      </div>
      <div className="filter-row">
        <div className="filter-tabs" role="group" aria-label="Filtrar por progreso">
          {filters.map((item) => (
            <button
              key={item.id}
              aria-pressed={filter === item.id}
              className={filter === item.id ? 'selected' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              {item.id === 'all' && <span>{games.length}</span>}
            </button>
          ))}
        </div>
        <span className="result-count" aria-live="polite">
          {results.length} {results.length === 1 ? 'juego' : 'juegos'}
        </span>
      </div>
      {results.length ? (
        <div className="game-grid library-grid">
          {results.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No encontramos esa aventura"
          description="Prueba con otro nombre o cambia los filtros de progreso."
          onReset={reset}
        />
      )}
      <div className="library-footnote">
        <ShieldNote />
      </div>
    </>
  )
}
function ShieldNote() {
  return (
    <>
      <span className="demo-dot" />
      <p>
        Una biblioteca de ejemplo, a tu ritmo. El progreso es manual y se guarda en este navegador.
      </p>
    </>
  )
}
