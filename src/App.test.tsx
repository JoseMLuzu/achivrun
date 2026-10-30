import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { ProgressProvider } from './features/progress/ProgressProvider'
import { createInitialState } from './features/progress/storage'
import { achievements } from './data/achievements'
import type { SpoilerLevel } from './types'

function renderPage(path: string, level: SpoilerLevel = 1) {
  const state = { ...createInitialState(), spoilerLevel: level }
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(state) })
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider>
        <AppRoutes />
      </ProgressProvider>
    </MemoryRouter>,
  )
}
afterEach(() => vi.unstubAllGlobals())
describe('route rendering and spoiler-safe initial HTML', () => {
  it.each([
    ['/', 'Tu próxima conquista.'],
    ['/library', 'Tu biblioteca.'],
    ['/guides', 'El camino al 100 %.'],
    ['/games/persona-3', 'Sin dato verificado'],
    ['/games/persona-3/guide', 'Un logro a la vez.'],
    ['/games/not-a-game', 'Esta aventura no está aquí.'],
    ['/unknown', 'Esta aventura no está aquí.'],
  ])('renders %s', (path, expected) => {
    const markup = renderPage(path)
    expect(markup).toContain(expected)
    expect(markup).toContain('AchivRun')
    expect(markup).not.toContain('Missable')
  })
  it.each([1, 2] as const)(
    'never puts a secret name or full instructions into HTML at level %s',
    (level) => {
      const markup = renderPage('/games/persona-3/guide', level)
      expect(markup).not.toContain(achievements[2]!.title)
      expect(markup).not.toContain(achievements[2]!.instructions)
      expect(markup).toContain('Logro secreto')
    },
  )
  it('keeps hints and instructions collapsed even after selecting full-guide mode', () => {
    const markup = renderPage('/games/persona-3/guide', 3)
    expect(markup).toContain(achievements[2]!.title)
    expect(markup).not.toContain(achievements[2]!.hint)
    expect(markup).not.toContain(achievements[2]!.instructions)
  })
})
