import { ArrowUpRight, BookOpen, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GameArtwork } from '@/components/GameArtwork'
import { Progress } from '@/components/ui/progress'
import { useGameProgress } from './useGameProgress'
import type { Game } from '@/types'

export function GameCard({ game }: { game: Game }) {
  const { percent, completed, total, remaining } = useGameProgress(game.id)
  return (
    <Link to={`/games/${game.id}`} className="game-card group">
      <div className="game-cover">
        <GameArtwork src={game.cover} title={game.title} />
        <span className="cover-arrow">
          <ArrowUpRight size={18} />
        </span>
        {game.hasGuide && (
          <span className="guide-badge">
            <BookOpen size={12} /> Guía disponible
          </span>
        )}
        {percent === 100 && (
          <span className="complete-badge">
            <Check size={14} /> Completado
          </span>
        )}
      </div>
      <div className="game-card-info">
        <h3>{game.title}</h3>
        <div className="game-progress-label">
          <span>
            {completed}
            <span className="text-muted-foreground"> / {total} logros</span>
          </span>
          <strong>{percent}%</strong>
        </div>
        <Progress value={percent} label={`Progreso de ejemplo de ${game.title}`} />
        <p>
          {remaining ? `${remaining} logros por descubrir` : 'Todos los objetivos completados'}{' '}
          <span>· Ejemplo</span>
        </p>
      </div>
    </Link>
  )
}
