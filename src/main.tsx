import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { App } from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProgressProvider } from './features/progress/ProgressProvider'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
)
