import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'

export function GameArtwork({
  src,
  title,
  className = '',
  hero = false,
}: {
  src: string
  title: string
  className?: string
  hero?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <div
      className={`artwork-fallback ${className}`}
      role={hero ? undefined : 'img'}
      aria-label={hero ? undefined : title}
      aria-hidden={hero || undefined}
    >
      {!hero && (
        <>
          <Gamepad2 size={36} />
          <span>{title}</span>
        </>
      )}
    </div>
  ) : (
    <img
      src={src}
      alt={hero ? '' : title}
      className={className}
      onError={() => setFailed(true)}
      loading={hero ? 'eager' : 'lazy'}
    />
  )
}
