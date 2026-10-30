import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  Gamepad2,
  LayoutDashboard,
  Library,
  Menu,
  ShieldCheck,
  X,
  ArrowUpRight,
  FlaskConical,
} from 'lucide-react'
import { motion } from 'motion/react'
import { SpoilerControl } from '@/features/spoiler-protection/SpoilerControl'
import { usePlayerProgress } from '@/features/progress/ProgressProvider'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { games } from '@/data/games'
import { useGameProgress } from '@/features/games/useGameProgress'

const navigation = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/library', label: 'Mi biblioteca', icon: Library },
  { to: '/guides', label: 'Guías de logros', icon: BookOpen },
]
export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const firstRoute = useRef(true)
  const { storageError } = usePlayerProgress()
  const { percent: currentPercent } = useGameProgress('persona-3')
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
    if (firstRoute.current) firstRoute.current = false
    else mainRef.current?.focus()
  }, [location.pathname])
  const section =
    location.pathname === '/'
      ? 'Inicio'
      : location.pathname === '/library'
        ? 'Mi biblioteca'
        : location.pathname === '/guides'
          ? 'Guías de logros'
          : 'Tu juego'
  const sidebarContent = (
    <>
      <Link className="brand" to="/" aria-label="Missable, inicio">
        <img src="/favicon.svg" alt="" />
        <span>
          missable<span className="brand-period">.</span>
        </span>
      </Link>
      <div className="sidebar-caption">TU COMPAÑERO DE JUEGO</div>
      <nav aria-label="Navegación principal">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {to === '/library' && <span className="nav-count">{games.length}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-current">
        <p className="sidebar-caption">EN TU RADAR</p>
        <Link to="/games/persona-3" onClick={() => setMenuOpen(false)}>
          <span className="mini-game-icon">P3</span>
          <span>
            Persona 3 Reload
            <small>
              <i /> {currentPercent === 100 ? 'Completado' : 'En progreso'}
            </small>
          </span>
          <ChevronRight size={15} />
        </Link>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <ShieldCheck size={22} />
          <h3>Disfruta la historia.</h3>
          <p>
            Nosotros cuidamos de
            <br />
            lo que podrías perderte.
          </p>
          <button
            onClick={() => {
              setMenuOpen(false)
              setAboutOpen(true)
            }}
          >
            Conoce Missable <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="local-profile">
          <span className="profile-avatar">
            <Gamepad2 size={19} />
          </span>
          <span>
            Tu espacio de juego<small>Perfil local · Sin conexión a Steam</small>
          </span>
          <span className="status-dot" />
        </div>
      </div>
    </>
  )
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <aside className="sidebar">{sidebarContent}</aside>
      <Dialog
        open={menuOpen}
        onOpenChange={setMenuOpen}
        title="Navegación"
        description="Explora tu espacio de juego."
      >
        <div className="mobile-navigation">{sidebarContent}</div>
      </Dialog>
      <div className="app-body">
        <header className="topbar">
          <div className="breadcrumb">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label="Abrir navegación"
              onClick={() => setMenuOpen(true)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <span className="breadcrumb-brand">Mi espacio</span>
            <ChevronRight size={13} />
            <span>{section}</span>
          </div>
          <div className="topbar-actions">
            <span className="demo-badge">
              <FlaskConical size={12} /> Prototipo local
            </span>
            <SpoilerControl compact />
          </div>
        </header>
        <main id="main-content" ref={mainRef} tabIndex={-1} className="main-content">
          {storageError && (
            <div className="storage-error" role="alert">
              {storageError}
            </div>
          )}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
        <footer className="site-footer">
          <span>
            missable<span className="text-primary">.</span>{' '}
            <span className="footer-tagline">Never miss an achievement again.</span>
          </span>
          <span>Hecho para disfrutar el camino.</span>
        </footer>
      </div>
      <Dialog
        open={aboutOpen}
        onOpenChange={setAboutOpen}
        title="Cada logro. A tu ritmo."
        description="Missable te acompaña sin adelantarse a tu historia."
      >
        <div className="about-copy">
          <p>
            Explora tu biblioteca, lleva una lista de objetivos y decide cuándo quieres ver una
            pista.
          </p>
          <p>
            Esta primera versión usa datos, estadísticas y reglas ficticias. Las portadas
            identifican los juegos; los objetivos no son guías reales. No existe conexión con Steam.
          </p>
          <p>Tus cambios se guardan únicamente en este navegador.</p>
        </div>
        <Button className="mt-6" onClick={() => setAboutOpen(false)}>
          Volver a mi partida
        </Button>
      </Dialog>
    </div>
  )
}
