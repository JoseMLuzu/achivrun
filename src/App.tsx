import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { GuidesPage } from '@/pages/GuidesPage'
import { GameDetailPage } from '@/pages/GameDetailPage'
import { AchievementGuidePage } from '@/pages/AchievementGuidePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="guides" element={<GuidesPage />} />
        <Route path="games/:gameId" element={<GameDetailPage />} />
        <Route path="games/:gameId/guide" element={<AchievementGuidePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
