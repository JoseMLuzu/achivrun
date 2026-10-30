import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  RotateCcw,
  ShieldCheck,
  Trophy,
} from 'lucide-react'
import { games } from '@/data/games'
import { Button } from '@/components/ui/button'
import { GameArtwork } from '@/components/GameArtwork'
import { Progress } from '@/components/ui/progress'
import { ChapterSelector } from '@/features/progress/ChapterSelector'
import { useGameProgress } from '@/features/games/useGameProgress'
import { ObjectivePreview } from '@/features/achievements/ObjectivePreview'
import { SpoilerControl } from '@/features/spoiler-protection/SpoilerControl'
import { categoryLabels } from '@/data/achievements'
import { NotFoundPage } from './NotFoundPage'
import type { Game } from '@/types'

export function GameDetailPage() {
  const { gameId } = useParams()
  const game = games.find((item) => item.id === gameId)
  return game ? <GameDetail game={game} /> : <NotFoundPage />
}
function GameDetail({ game }: { game: Game }) {
  const { items, completed, total, remaining, percent } = useGameProgress(game.id)
  return (
    <>
      <Link className="back-link" to="/library">
        <ArrowLeft size={15} /> Mi biblioteca
      </Link>
      <section className="game-detail-hero">
        <GameArtwork src={game.cover} title={game.title} className="detail-cover" />
        <div className="game-detail-copy">
          <p className="eyebrow">TU PRÓXIMA CONQUISTA · DATOS DE EJEMPLO</p>
          <h1>
            {game.title}
            <span className="text-primary">.</span>
          </h1>
          <p className="text-muted-foreground text-sm">{game.genre}</p>
          <div className="detail-progress-heading">
            <span>
              <Trophy size={16} /> {completed} de {total} logros
            </span>
            <strong>{percent}%</strong>
          </div>
          <Progress value={percent} label="Progreso de ejemplo" />
          <p className="detail-remaining">{remaining} pendientes · Seguimiento manual</p>
          <div className="detail-actions">
            {game.hasGuide ? (
              <Button asChild>
                <Link to={`/games/${game.id}/guide`}>
                  <BookOpen size={16} /> Abrir guía de ejemplo <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <span className="unavailable-guide">Guía todavía no disponible</span>
            )}
            <SpoilerControl />
          </div>
        </div>
      </section>
      <ChapterSelector game={game} />
      <div className="detail-facts">
        <div>
          <Clock3 size={19} />
          <span>
            Tiempo para el 100 %
            <strong>
              {game.verifiedCompletionHours
                ? `${game.verifiedCompletionHours} horas verificadas`
                : 'Sin dato verificado'}
            </strong>
          </span>
        </div>
        <div>
          <RotateCcw size={19} />
          <span>
            Partidas necesarias
            <strong>
              {game.verifiedPlaythroughs
                ? `${game.verifiedPlaythroughs} partidas verificadas`
                : 'Sin dato verificado'}
            </strong>
          </span>
        </div>
        <div>
          <ShieldCheck size={19} />
          <span>
            Control de spoilers<strong>Siempre en tus manos</strong>
          </span>
        </div>
      </div>
      {game.hasGuide ? (
        <>
          <ObjectivePreview gameId={game.id} />
          <section className="category-section">
            <div className="section-heading">
              <h2>Hay más de una forma de completar.</h2>
            </div>
            <p className="panel-subtitle">Categorías combinables del catálogo ficticio.</p>
            <div className="category-grid">
              {Object.entries(categoryLabels).map(([category, label]) => (
                <Link key={category} to={`/games/${game.id}/guide?category=${category}`}>
                  <span>{label}</span>
                  <strong>
                    {
                      items.filter((a) =>
                        a.categories.includes(category as keyof typeof categoryLabels),
                      ).length
                    }
                  </strong>
                  <ArrowRight size={15} />
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="guide-notice">
          <BookOpen size={24} />
          <div>
            <strong>Una aventura que aún estamos preparando.</strong>
            <p>
              El progreso de este juego es un ejemplo. Por ahora puedes consultar las guías
              interactivas de los otros juegos.
            </p>
            <Link className="subtle-link mt-3" to="/guides">
              Explorar guías <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
      <p className="fiction-note mt-6">
        Todos los logros, etapas y avances son ficticios. No constituyen una guía real de{' '}
        {game.title}.
      </p>
    </>
  )
}
