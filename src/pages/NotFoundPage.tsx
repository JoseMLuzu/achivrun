import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function NotFoundPage() {
  return (
    <div className="empty-state not-found">
      <Compass size={40} />
      <p className="eyebrow">FUERA DEL MAPA · 404</p>
      <h1>Esta aventura no está aquí.</h1>
      <p>El juego o la página que buscas no existe en este prototipo.</p>
      <Button asChild>
        <Link to="/library">Volver a mi biblioteca</Link>
      </Button>
    </div>
  )
}
