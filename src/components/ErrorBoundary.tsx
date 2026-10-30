import { Component, type ReactNode } from 'react'
import { Button } from './ui/button'
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? (
      <main className="empty-state not-found">
        <h1>La partida se ha pausado.</h1>
        <p>No pudimos mostrar esta pantalla. Recarga para volver a intentarlo.</p>
        <Button onClick={() => window.location.reload()}>Recargar Missable</Button>
      </main>
    ) : (
      this.props.children
    )
  }
}
