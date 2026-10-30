import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { SpoilerLevel } from '@/types'
import { createInitialState, readSavedState, STORAGE_KEY, type SavedState } from './storage'

interface ProgressContextValue {
  state: SavedState
  storageError: string | null
  setSpoilerLevel: (level: SpoilerLevel) => void
  setChapter: (gameId: string, chapter: number) => void
  toggleAchievement: (gameId: string, id: string) => void
}
const ProgressContext = createContext<ProgressContextValue | null>(null)
function loadState() {
  try {
    return { state: readSavedState(localStorage), error: null }
  } catch {
    return {
      state: createInitialState(),
      error: 'No se pudieron recuperar tus preferencias. Se cargó el escenario de ejemplo.',
    }
  }
}
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadState)
  const [state, setState] = useState(initial.state)
  const [storageError, setStorageError] = useState<string | null>(initial.error)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      setStorageError(
        'El navegador no permite guardar cambios. El progreso se conservará solo durante esta sesión.',
      )
    }
  }, [state])
  const value: ProgressContextValue = {
    state,
    storageError,
    setSpoilerLevel: (spoilerLevel) => setState((s) => ({ ...s, spoilerLevel })),
    setChapter: (gameId, chapter) =>
      setState((s) => ({
        ...s,
        progress: { ...s.progress, [gameId]: { ...s.progress[gameId]!, chapter } },
      })),
    toggleAchievement: (gameId, id) =>
      setState((s) => {
        const current = s.progress[gameId]!
        const completedIds = current.completedIds.includes(id)
          ? current.completedIds.filter((item) => item !== id)
          : [...current.completedIds, id]
        return { ...s, progress: { ...s.progress, [gameId]: { ...current, completedIds } } }
      }),
  }
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
export function usePlayerProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('usePlayerProgress requires ProgressProvider')
  return context
}
