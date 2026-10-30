import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye, Lightbulb, LockKeyhole, Trophy } from 'lucide-react'
import type { Achievement, PlayerProgress, SpoilerLevel } from '@/types'
import { Button } from '@/components/ui/button'
import { categoryLabels } from '@/data/achievements'
import { presentAchievement } from '@/features/spoiler-protection/presentation'
import { evaluateObjective } from '@/features/progress/rules'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'

export function AchievementRow({
  achievement,
  progress,
  level,
  highlighted,
}: {
  achievement: Achievement
  progress: PlayerProgress
  level: SpoilerLevel
  highlighted: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { toggleAchievement } = usePlayerProgress()
  const view = presentAchievement(achievement, level)
  const warning = evaluateObjective(achievement, progress)
  const completed = warning.status === 'completed'
  return (
    <article
      className={`achievement-row ${completed ? 'is-complete' : ''} ${highlighted ? 'highlighted' : ''}`}
      id={achievement.id}
    >
      <div className="achievement-row-main">
        <span className={`achievement-symbol ${view.protectedIdentity ? 'protected' : ''}`}>
          {view.protectedIdentity ? <LockKeyhole size={21} /> : <Trophy size={21} />}
        </span>
        <div className="achievement-copy">
          <div className="achievement-title">
            <h3>{view.title}</h3>
            <span className="sample-tag">Ejemplo</span>
          </div>
          <p>{view.description}</p>
          <div className="achievement-tags">
            {achievement.categories.map((category) => (
              <span key={category} className={`category-tag ${category}`}>
                {categoryLabels[category]}
              </span>
            ))}
            <span className={`objective-status ${warning.status}`}>{warning.safeMessage}</span>
          </div>
        </div>
        <label className="achievement-check">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleAchievement(achievement.gameId, achievement.id)}
            aria-label={`Marcar ${view.title} como ${completed ? 'pendiente' : 'completado'}`}
          />
          <span className="sr-only">Completado</span>
        </label>
      </div>
      <div className="achievement-row-bottom">
        {level === 1 ? (
          <span className="protected-detail">
            <LockKeyhole size={12} /> Pistas protegidas por tu nivel de spoilers
          </span>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            aria-expanded={expanded}
            aria-controls={`details-${achievement.id}`}
            onClick={() => setExpanded((value) => !value)}
          >
            <Lightbulb size={14} /> {expanded ? 'Ocultar pista' : 'Consultar pista'}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </Button>
        )}
      </div>
      {expanded && level >= 2 && (
        <div id={`details-${achievement.id}`} className="achievement-detail">
          <p>
            <Lightbulb size={16} />
            {view.hint}
          </p>
          {level === 3 &&
            (revealed ? (
              <div className="full-instructions">
                <span className="eyebrow">INSTRUCCIONES FICTICIAS</span>
                <p>{view.instructions}</p>
                <Button size="sm" variant="ghost" onClick={() => setRevealed(false)}>
                  Ocultar instrucciones
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setRevealed(true)}>
                <Eye size={14} /> Revelar instrucciones completas
              </Button>
            ))}
        </div>
      )}
    </article>
  )
}
