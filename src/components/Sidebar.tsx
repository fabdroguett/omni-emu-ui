import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { Button } from './ui/Button'
import { Tooltip } from './ui/Tooltip'
import { FolderGit2, Settings, Download, Database, Activity, Monitor, HardDrive, Box, Wrench, ChevronLeft, ChevronRight, Gamepad2, Search } from 'lucide-react'

const NAV_ITEMS = [
  { route: '/descargas', label: 'Descargas', icon: Download, badge: null },
  { route: '/', label: 'Dashboard', icon: Gamepad2, badge: null },
  { route: '/diagnostico', label: 'Diagnóstico', icon: Activity, badge: null },
  { route: '/estructura', label: 'Estructura', icon: FolderGit2, badge: null },
  { route: '/watcher', label: 'Watcher', icon: Database, badge: null },
  { route: '/monitor', label: 'Monitor', icon: Monitor, badge: null },
  { route: '/explorador', label: 'Explorador', icon: HardDrive, badge: null },
  { route: '/biblioteca', label: 'Biblioteca', icon: Box, badge: null },
  { route: '/bigbox', label: 'BigBox', icon: Wrench, badge: null },
  { route: '/ajustes', label: 'Ajustes', icon: Settings, badge: null }
] as const

export function Sidebar() {
  const { route, setRoute, sidebarCollapsed } = useAppStore()
  const [hovered, setHovered] = useState<string | null>(null)

  const activeItem = NAV_ITEMS.find(i => i.route === route)

  if (sidebarCollapsed) {
    return (
      <aside className="w-14 bg-surface border-r border-line flex flex-col transition-all duration-200 relative">
        <div className="flex h-14 items-center justify-center border-b border-line">
          <Gamepad2 size={22} className="text-accent" />
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {NAV_ITEMS.map(({ route: itemRoute, label, icon: Icon, badge }) => {
            const isActive = route === itemRoute
            return (
              <Tooltip key={itemRoute} content={label} position="right" delay={100}>
                <button
                  onClick={() => setRoute(itemRoute)}
                  className={cn(
                    'relative w-full h-10 rounded-lg flex items-center justify-center transition-colors',
                    'hover:bg-surface-elevated',
                    isActive && 'bg-accent/15 text-accent',
                    'text-text-muted'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                >
                  <Icon size={20} />
                  {badge && <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-error text-white rounded-full flex items-center justify-center">{badge}</span>}
                </button>
              </Tooltip>
            )
          })}
        </nav>
        <div className="p-2 border-t border-line">
          <Tooltip content="Expandir barra lateral" position="right">
            <button onClick={() => useAppStore.getState().patchConfig({ global: { sidebarCollapsed: false } })} className="w-full h-10 rounded-lg flex items-center justify-center hover:bg-surface-elevated text-text-muted transition-colors">
              <ChevronRight size={20} />
            </button>
          </Tooltip>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-surface border-r border-line flex flex-col transition-all duration-200">
      <div className="flex h-14 items-center justify-between px-4 border-b border-line">
        <span className="font-semibold text-text">OmniEmu</span>
        <Tooltip content="Colapsar barra lateral" position="right">
          <button onClick={() => useAppStore.getState().patchConfig({ global: { sidebarCollapsed: true } })} className="p-1 rounded hover:bg-surface-elevated text-text-muted transition-colors">
            <ChevronLeft size={18} />
          </button>
        </Tooltip>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {NAV_ITEMS.map(({ route: itemRoute, label, icon: Icon, badge }) => {
          const isActive = route === itemRoute
          return (
            <Tooltip key={itemRoute} content={badge ? `${label} (${badge})` : label} position="right" delay={0}>
              <button
                onClick={() => setRoute(itemRoute)}
                className={cn(
                  'w-full h-10 rounded-lg flex items-center gap-3 px-3 transition-colors',
                  'hover:bg-surface-elevated',
                  isActive ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium truncate">{label}</span>
                {badge && <span className="ml-auto w-5 h-5 text-xs bg-error text-white rounded-full flex items-center justify-center">{badge}</span>}
              </button>
            </Tooltip>
          )
        })}
      </nav>
      <div className="p-3 border-t border-line">
        <div className="flex items-center gap-2 text-xs text-text-muted px-2">
          <span>v2.1.2-ui</span>
          <span className="mx-1">·</span>
          <span>Modo UI</span>
        </div>
      </div>
    </aside>
  )
}