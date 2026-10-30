import { BookOpen, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { games } from '@/data/games'
import { GameArtwork } from '@/components/GameArtwork'
import { PageHeading } from '@/components/PageHeading'

export function GuidesPage() {
  return (
    <>
      <PageHeading
        eyebrow="UNA AYUDA. NINGUNA SORPRESA ARRUINADA."
        title="El camino al 100 %."
        description="Guías que avanzan contigo. Tú decides cuánto quieres descubrir."
      />
      <div className="guide-notice">
        <ShieldCheck size={23} />
        <div>
          <strong>Tu historia está protegida.</strong>
          <p>Estos recorridos son ejemplos interactivos con objetivos y condiciones ficticios.</p>
        </div>
      </div>
      <div className="guides-grid">
        {games
          .filter((g) => g.hasGuide)
          .map((game) => (
            <Link key={game.id} to={`/games/${game.id}/guide`} className="guide-card">
              <GameArtwork src={game.cover} title={game.title} />
              <div>
                <span className="eyebrow">GUÍA DE DEMOSTRACIÓN</span>
                <h2>{game.title}</h2>
                <p>
                  <BookOpen size={14} /> Objetivos, pistas y checklist local
                </p>
                <span className="subtle-link">
                  Explorar guía <ArrowUpRight size={15} />
                </span>
              </div>
            </Link>
          ))}
      </div>
    </>
  )
}
