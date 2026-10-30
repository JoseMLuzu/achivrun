import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}

export function AppRoutes() {
  return <Routes><Route element={<AppLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="library" element={<LibraryPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>
}
