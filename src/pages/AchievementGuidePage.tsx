import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Search } from 'lucide-react'
import { games } from '@/data/games'
import { categoryLabels } from '@/data/achievements'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/EmptyState'
import { PageHeading } from '@/components/PageHeading'
import { Progress } from '@/components/ui/progress'
import { useGameProgress } from '@/features/games/useGameProgress'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'
import { evaluateObjective } from '@/features/progress/rules'
import { ChapterSelector } from '@/features/progress/ChapterSelector'
import { SpoilerControl } from '@/features/spoiler-protection/SpoilerControl'
import { presentAchievement } from '@/features/spoiler-protection/presentation'
import { AchievementRow } from '@/features/achievements/AchievementRow'
import { NotFoundPage } from './NotFoundPage'
import type { AchievementCategory, Game, ObjectiveStatus } from '@/types'

export function AchievementGuidePage() {
  const { gameId } = useParams()
  const game = games.find((item) => item.id === gameId)
  return game ? <Guide key={game.id} game={game} /> : <NotFoundPage />
}
function Guide({ game }: { game: Game }) {
  const [params, setParams] = useSearchParams()
  const requestedCategory = params.get('category')
  const category =
    requestedCategory && Object.hasOwn(categoryLabels, requestedCategory)
      ? (requestedCategory as AchievementCategory)
      : 'all'
  const highlighted = params.get('objective')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ObjectiveStatus | 'all'>('all')
  const [limit, setLimit] = useState(8)
  const { items, progress, completed, total, percent } = useGameProgress(game.id)
  const { state } = usePlayerProgress()
  if (!game.hasGuide)
    return (
      <>
        <PageHeading
          eyebrow="GUÍAS DE LOGROS"
          title="Aún queda camino."
          description={`La guía de ${game.title} todavía no está disponible.`}
        />
        <Button asChild>
          <Link to="/guides">Ver guías disponibles</Link>
        </Button>
      </>
    )
  const filtered = items
    .filter(
      (a) =>
        (category === 'all' || a.categories.includes(category)) &&
        (status === 'all' || evaluateObjective(a, progress).status === status) &&
        presentAchievement(a, state.spoilerLevel)
          .title.toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => Number(b.id === highlighted) - Number(a.id === highlighted))
  const reset = () => {
    setQuery('')
    setStatus('all')
    setParams({})
    setLimit(8)
  }
  return (
    <>
      <Link className="back-link" to={`/games/${game.id}`}>
        <ArrowLeft size={15} /> {game.title}
      </Link>
      <PageHeading
        eyebrow="GUÍA INTERACTIVA DE EJEMPLO"
        title="Un logro a la vez."
        description={`${game.title} · Objetivos ficticios para explorar Missable.`}
        action={<SpoilerControl />}
      />
      <div className="guide-progress">
        <BookOpen size={22} />
        <div>
          <strong>
            {completed} de {total} objetivos completados
          </strong>
          <Progress value={percent} label="Objetivos de ejemplo completados" />
        </div>
        <span>{percent}%</span>
      </div>
      <ChapterSelector game={game} />
      <div className="guide-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Buscar logros"
            placeholder="Buscar entre los logros visibles…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setLimit(8)
            }}
          />
        </div>
        <label className="sr-only" htmlFor="achievement-category">
          Categoría
        </label>
        <select
          id="achievement-category"
          value={category}
          onChange={(event) => {
            setParams(event.target.value === 'all' ? {} : { category: event.target.value })
            setLimit(8)
          }}
        >
          <option value="all">Todas las categorías</option>
          {Object.entries(categoryLabels).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="objective-status">
          Estado del objetivo
        </label>
        <select
          id="objective-status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as ObjectiveStatus | 'all')
            setLimit(8)
          }}
        >
          <option value="all">Todos los estados</option>
          <option value="available">Disponibles</option>
          <option value="expiring">Próximos a expirar</option>
          <option value="completed">Completados</option>
          <option value="unknown">Sin determinar</option>
          <option value="upcoming">Próximos</option>
          <option value="expired">Ventana cerrada</option>
        </select>
      </div>
      <div className="guide-list-heading">
        <span aria-live="polite">{filtered.length} objetivos</span>
        <span>Reglas ficticias · No son una guía real</span>
      </div>
      {filtered.length ? (
        <div className="achievement-list">
          {filtered.slice(0, limit).map((achievement) => (
            <AchievementRow
              key={`${achievement.id}-${state.spoilerLevel}`}
              achievement={achievement}
              progress={progress}
              level={state.spoilerLevel}
              highlighted={achievement.id === highlighted}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Tu búsqueda no tiene resultados"
          description="Los nombres secretos no se incluyen en búsquedas mientras están protegidos."
          onReset={reset}
        />
      )}
      {limit < filtered.length && (
        <div className="load-more">
          <Button variant="outline" onClick={() => setLimit((value) => value + 8)}>
            Mostrar más objetivos ({Math.min(8, filtered.length - limit)})
          </Button>
        </div>
      )}
    </>
  )
}
