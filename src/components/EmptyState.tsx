import { SearchX } from 'lucide-react'
import { Button } from './ui/button'
export function EmptyState({
  title,
  description,
  onReset,
}: {
  title: string
  description: string
  onReset?: () => void
}) {
  return (
    <div className="empty-state">
      <SearchX size={30} />
      <h2>{title}</h2>
      <p>{description}</p>
      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
