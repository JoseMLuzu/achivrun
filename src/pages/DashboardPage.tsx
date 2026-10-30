import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CircleAlert,
  Flag,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { PageHeading } from '@/components/PageHeading'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { GameArtwork } from '@/components/GameArtwork'
import { games, primaryGame } from '@/data/games'
import { useGameProgress } from '@/features/games/useGameProgress'
import { GameCard } from '@/features/games/GameCard'
import { ChapterSelector } from '@/features/progress/ChapterSelector'
import { ObjectivePreview } from '@/features/achievements/ObjectivePreview'
import { evaluateObjective } from '@/features/progress/rules'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'
import { spoilerLabels } from '@/features/spoiler-protection/SpoilerControl'

export function DashboardPage() {
  const game = primaryGame
  const { items, progress, completed, total, percent } = useGameProgress(game.id)
  const { state } = usePlayerProgress()
  const available = items.filter(
    (a) => evaluateObjective(a, progress).status === 'available',
  ).length
  const expiring = items.filter((a) => evaluateObjective(a, progress).status === 'expiring').length
  return (
    <>
      <PageHeading
        eyebrow="MENOS DUDAS. MÁS JUEGO."
        title="Tu próxima conquista."
        description="Sigue tu camino. Nosotros te ayudamos a no perderte nada."
        action={
          <span className="welcome-marker">
            <span className="status-dot" /> Todo listo para tu partida
          </span>
        }
      />
      <section className="current-game" aria-label="Juego actual">
        <GameArtwork src={game.hero} title={game.title} className="hero-artwork" hero />
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="hero-content">
          <span className="playing-label">
            <span /> CONTINÚA TU PARTIDA
          </span>
          <h2>
            Persona 3<br />
            <span>Reload</span>
            <span className="hero-title-dot">.</span>
          </h2>
          <p>
            Cada día cuenta.
            <br />
            Disfruta de la historia, sin perder el rumbo.
          </p>
          <div className="hero-actions">
            <Button asChild>
              <Link to={`/games/${game.id}`}>
                <Play size={15} fill="currentColor" /> Continuar aventura <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="hero-guide">
              <Link to={`/games/${game.id}/guide`}>
                <BookOpen size={16} /> Abrir guía
              </Link>
            </Button>
          </div>
        </div>
        <div className="hero-top-right">
          <span className="platform-label">PC / STEAM</span>
          <span className="hero-demo">DATOS DE EJEMPLO</span>
        </div>
        <div className="hero-progress">
          <span className="hero-trophy">
            <Trophy size={18} />
          </span>
          <div>
            <span>Tu camino al 100 %</span>
            <strong>
              {completed} <small>/ {total} logros</small>
              <b>{percent}%</b>
            </strong>
            <Progress value={percent} label="Progreso de ejemplo de Persona 3 Reload" />
          </div>
        </div>
        <div className="hero-edge-label">THE JOURNEY IS YOURS</div>
      </section>
      <ChapterSelector game={game} />
      <div className="dashboard-middle">
        <ObjectivePreview gameId={game.id} />
        <section className="panel journey-panel">
          <div className="section-heading">
            <h2>Tu partida, bajo control</h2>
            <Flag size={17} className="text-muted-foreground" />
          </div>
          <div className="journey-stats">
            <div>
              <span className="stat-icon accent">
                <Check size={17} />
              </span>
              <strong>{completed}</strong>
              <span>Completados</span>
            </div>
            <div>
              <span className="stat-icon neutral">
                <Sparkles size={17} />
              </span>
              <strong>{available}</strong>
              <span>Disponibles</span>
            </div>
            <div>
              <span className="stat-icon amber">
                <CircleAlert size={17} />
              </span>
              <strong>{expiring}</strong>
              <span>Por revisar</span>
            </div>
          </div>
          <div className="safe-mode-note">
            <ShieldCheck size={21} />
            <div>
              <strong>
                {spoilerLabels[state.spoilerLevel]}
                {state.spoilerLevel === 1 ? ', por supuesto.' : ' activado.'}
              </strong>
              <p>
                {state.spoilerLevel === 1
                  ? 'Las sorpresas se quedan dentro del juego.'
                  : 'Tú eliges cuándo consultar cada detalle.'}
              </p>
            </div>
          </div>
          <p className="fiction-note">Progreso manual de demostración.</p>
        </section>
      </div>
      <section className="recent-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UN MUNDO POR COMPLETAR</p>
            <h2>Vuelve a tu biblioteca</h2>
          </div>
          <Link className="subtle-link" to="/library">
            Ver todos los juegos <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="game-grid recent-grid">
          {games.slice(1, 5).map((item) => (
            <GameCard key={item.id} game={item} />
          ))}
        </div>
      </section>
      <div className="demo-disclaimer">
        <span className="demo-dot" />
        <p>
          Estás explorando AchivRun con datos de ejemplo. Los logros, avances y reglas son
          ficticios.
        </p>
      </div>
    </>
  )
}
