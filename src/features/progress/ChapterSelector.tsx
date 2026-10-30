import { MapPin } from 'lucide-react'
import { usePlayerProgress } from './ProgressProvider'
import type { Game } from '@/types'

export function ChapterSelector({ game }: { game: Game }) {
  const { state, setChapter } = usePlayerProgress()
  return (
    <div className="chapter-selector">
      <span className="chapter-icon">
        <MapPin size={19} />
      </span>
      <div>
        <label htmlFor={`chapter-${game.id}`}>¿Por dónde vas?</label>
        <p>Etapas ficticias de demostración</p>
      </div>
      <select
        id={`chapter-${game.id}`}
        value={state.progress[game.id]!.chapter}
        onChange={(event) => setChapter(game.id, Number(event.target.value))}
      >
        {game.chapters.map((chapter, index) => (
          <option key={chapter} value={index}>
            {chapter}
          </option>
        ))}
      </select>
    </div>
  )
}
