import { ArrowUpRight, CircleCheck, Clock3, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGameProgress } from '@/features/games/useGameProgress'
import { evaluateObjective } from '@/features/progress/rules'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'
import { presentAchievement } from '@/features/spoiler-protection/presentation'

export function ObjectivePreview({ gameId }: { gameId: string }) {
  const { items, progress } = useGameProgress(gameId)
  const { state } = usePlayerProgress()
  const objectives = items
    .slice(0, 6)
    .filter((a) => a.categories.includes('missable') || a.categories.includes('secret'))
    .slice(0, 3)
  return (
    <section className="panel objective-panel">
      <div className="section-heading">
        <h2>
          Que no se te escape nada<span className="small-count">{objectives.length}</span>
        </h2>
        <Link className="subtle-link" to={`/games/${gameId}/guide`}>
          Ver guía <ArrowUpRight size={14} />
        </Link>
      </div>
      <p className="panel-subtitle">Tu lista de atención, sin revelar la historia.</p>
      <div className="objective-list">
        {objectives.map((achievement) => {
          const warning = evaluateObjective(achievement, progress)
          const view = presentAchievement(achievement, state.spoilerLevel)
          const Icon =
            warning.status === 'completed'
              ? CircleCheck
              : warning.status === 'expiring'
                ? Clock3
                : LockKeyhole
          return (
            <Link
              to={`/games/${gameId}/guide?objective=${achievement.id}`}
              key={achievement.id}
              className="objective-preview"
            >
              <span className={`objective-icon ${warning.status}`}>
                <Icon size={17} />
              </span>
              <span className="objective-preview-copy">
                <strong>{view.title}</strong>
                <small>{warning.safeMessage}</small>
              </span>
              <span className={`status-pill ${warning.status}`}>
                {warning.status === 'expiring'
                  ? 'Atención'
                  : warning.status === 'completed'
                    ? 'Hecho'
                    : warning.status === 'upcoming'
                      ? 'Próximo'
                      : 'Protegido'}
              </span>
              <ArrowUpRight size={14} className="objective-arrow" />
            </Link>
          )
        })}
      </div>
      <p className="fiction-note">Reglas ficticias · No representan condiciones del juego real.</p>
    </section>
  )
}
