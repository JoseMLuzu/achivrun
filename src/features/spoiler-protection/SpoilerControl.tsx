import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, ChevronDown } from 'lucide-react'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { SpoilerLevel } from '@/types'

export const spoilerLabels = { 1: 'Sin spoilers', 2: 'Solo pistas', 3: 'Guía completa' } as const
export function SpoilerControl({ compact = false }: { compact?: boolean }) {
  const { state, setSpoilerLevel } = usePlayerProgress()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const selectLevel = (level: SpoilerLevel) => {
    if (level === 3 && state.spoilerLevel !== 3) {
      setConfirm(true)
      return
    }
    setSpoilerLevel(level)
    setOpen(false)
  }
  return (
    <>
      <Button
        variant="outline"
        className={compact ? 'spoiler-trigger compact' : 'spoiler-trigger'}
        onClick={() => setOpen(true)}
      >
        <ShieldCheck size={16} />
        <span>{spoilerLabels[state.spoilerLevel]}</span>
        <ChevronDown size={13} />
      </Button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
          setConfirm(false)
        }}
        title="La historia, a tu ritmo."
        description="Tú decides cuánto quieres saber. Esta preferencia se guarda en este navegador."
      >
        <div className="spoiler-options">
          {([1, 2, 3] as const).map((level) => {
            const Icon = level === 1 ? ShieldCheck : level === 2 ? EyeOff : Eye
            return (
              <button
                key={level}
                className={`spoiler-option ${state.spoilerLevel === level ? 'selected' : ''}`}
                onClick={() => selectLevel(level)}
                aria-pressed={state.spoilerLevel === level}
              >
                <Icon size={21} />
                <span>
                  <strong>{spoilerLabels[level]}</strong>
                  <small>
                    {level === 1
                      ? 'Avisos seguros. Nombres secretos protegidos.'
                      : level === 2
                        ? 'Orientación adicional sin acontecimientos importantes.'
                        : 'Nombres revelados e instrucciones bajo demanda.'}
                  </small>
                </span>
                <span className="radio-dot" />
              </button>
            )
          })}
        </div>
        {confirm && (
          <div className="reveal-confirm" role="alert">
            <p>La guía completa puede revelar nombres y detalles de la historia.</p>
            <Button
              onClick={() => {
                setSpoilerLevel(3)
                setConfirm(false)
                setOpen(false)
              }}
            >
              Entiendo, activar guía completa
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Volver
            </Button>
          </div>
        )}
      </Dialog>
    </>
  )
}
