import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './AppShell'
import { lazy, Suspense, type ComponentType } from 'react'

// Lazy load all pages
const DownloadsPage = lazy(() => import('@/components/downloads/DownloadsPage').then(m => ({ default: m.DownloadsPage })))
const DashboardPage = lazy(() => import('@/gamerhub/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const DiagnosticsPage = lazy(() => import('@/gamerhub/pages/DiagnosticsPage').then(m => ({ default: m.DiagnosticsPage })))
const StructurePage = lazy(() => import('@/gamerhub/pages/StructurePage').then(m => ({ default: m.StructurePage })))
const WatcherPage = lazy(() => import('@/gamerhub/pages/WatcherPage').then(m => ({ default: m.WatcherPage })))
const MonitorPage = lazy(() => import('@/gamerhub/pages/MonitorPage').then(m => ({ default: m.MonitorPage })))
const ExplorerPage = lazy(() => import('@/gamerhub/pages/ExplorerPage').then(m => ({ default: m.ExplorerPage })))
const LibraryPage = lazy(() => import('@/gamerhub/pages/LibraryPage').then(m => ({ default: m.LibraryPage })))
const BigBoxPage = lazy(() => import('@/gamerhub/pages/BigBoxPage').then(m => ({ default: m.BigBoxPage })))
const SettingsPage = lazy(() => import('@/gamerhub/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

const LoadingFallback = () => (
  <div className="flex h-full items-center justify-center text-text-muted">
    <div className="animate-spin text-accent">⏳</div>
    <span className="ml-2">Cargando...</span>
  </div>
)

function withSuspense(Component: ComponentType) {
  return () => (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  )
}

// Use the lazy components directly with Suspense
const DashboardRoute = withSuspense(DashboardPage)
const DownloadsRoute = withSuspense(DownloadsPage)
const DiagnosticsRoute = withSuspense(DiagnosticsPage)
const StructureRoute = withSuspense(StructurePage)
const WatcherRoute = withSuspense(WatcherPage)
const MonitorRoute = withSuspense(MonitorPage)
const ExplorerRoute = withSuspense(ExplorerPage)
const LibraryRoute = withSuspense(LibraryPage)
const BigBoxRoute = withSuspense(BigBoxPage)
const SettingsRoute = withSuspense(SettingsPage)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardRoute /> },
      { path: '/descargas', element: <DownloadsRoute /> },
      { path: '/diagnostico', element: <DiagnosticsRoute /> },
      { path: '/estructura', element: <StructureRoute /> },
      { path: '/watcher', element: <WatcherRoute /> },
      { path: '/monitor', element: <MonitorRoute /> },
      { path: '/explorador', element: <ExplorerRoute /> },
      { path: '/biblioteca', element: <LibraryRoute /> },
      { path: '/bigbox', element: <BigBoxRoute /> },
      { path: '/ajustes', element: <SettingsRoute /> }
    ]
  }
])