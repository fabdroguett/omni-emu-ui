import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Command, Search, ChevronDown, ChevronUp, Download, Gamepad2, Database, Activity, Monitor, HardDrive, Box, Wrench, Settings, ExternalLink, Keyboard } from 'lucide-react'

const COMMANDS = [
  { id: 'new-download', label: 'Nueva descarga', desc: 'Añadir URL o lista de enlaces', icon: Download, action: () => useStore.getState().openDialog({ kind: 'add' }), shortcut: '⌘N' },
  { id: 'import', label: 'Importar archivo', desc: 'Importar .dat, .txt o .torrent', icon: Database, action: () => useStore.getState().openDialog({ kind: 'import' }), shortcut: '⌘I' },
  { id: 'grabber', label: 'Link Grabber', desc: 'Extraer enlaces de una página', icon: ExternalLink, action: () => useStore.getState().openDialog({ kind: 'grabber' }), shortcut: '⌘G' },
  { id: 'settings', label: 'Ajustes', desc: 'Abrir configuración', icon: Settings, action: () => useAppStore.getState().setRoute('/ajustes'), shortcut: '⌘,' },
  { id: 'library', label: 'Biblioteca', desc: 'Ver todos los juegos', icon: Gamepad2, action: () => useAppStore.getState().setRoute('/biblioteca'), shortcut: '⌘L' },
  { id: 'dashboard', label: 'Dashboard', desc: 'Volver al inicio', icon: Gamepad2, action: () => useAppStore.getState().setRoute('/'), shortcut: '⌘D' },
  { id: 'diagnostics', label: 'Diagnóstico', desc: 'Verificar DATs y hashes', icon: Activity, action: () => useAppStore.getState().setRoute('/diagnostico') },
  { id: 'watcher', label: 'Watcher', desc: 'Configurar monitorización', icon: Database, action: () => useAppStore.getState().setRoute('/watcher') },
  { id: 'monitor', label: 'Monitor', desc: 'Rendimiento y logs', icon: Monitor, action: () => useAppStore.getState().setRoute('/monitor') },
  { id: 'explorer', label: 'Explorador', desc: 'Navegar archivos en SD', icon: HardDrive, action: () => useAppStore.getState().setRoute('/explorador') },
  { id: 'structure', label: 'Estructura', desc: 'Ver árbol de carpetas', icon: Box, action: () => useAppStore.getState().setRoute('/estructura') },
  { id: 'bigbox', label: 'BigBox', desc: 'Emuladores y frontends', icon: Wrench, action: () => useAppStore.getState().setRoute('/bigbox') },
  { id: 'shortcuts', label: 'Atajos de teclado', desc: 'Ver todos los atajos', icon: Keyboard, action: () => useStore.getState().openDialog({ kind: 'shortcuts' }), shortcut: '⌘/' },
  { id: 'stats', label: 'Estadísticas', desc: 'Ver gráficos de descargas', icon: Activity, action: () => useStore.getState().openDialog({ kind: 'stats' }) },
  { id: 'toggle-sidebar', label: 'Alternar barra lateral', desc: 'Expandir/colapsar navegación', icon: ChevronLeft, action: () => useAppStore.getState().patchConfig({ global: { sidebarCollapsed: !useAppStore.getState().sidebarCollapsed } }), shortcut: '⌘B' },
  { id: 'clear-selection', label: 'Limpiar selección', desc: 'Desmarcar todas las descargas', icon: ChevronUp, action: () => useStore.getState().clearSelection(), shortcut: 'Esc' },
  { id: 'select-all', label: 'Seleccionar todo visible', desc: 'Marcar todas las descargas filtradas', icon: ChevronDown, action: () => useStore.getState().selectAll(useStore.getState().items.map(i => i.id)), shortcut: '⌘A' }
]

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (paletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [paletteOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!paletteOpen) return
      if (e.key === 'Escape') { setPaletteOpen(false); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); filteredCommands[selectedIndex]?.action(); setPaletteOpen(false) }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paletteOpen, selectedIndex])

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.desc.toLowerCase().includes(query.toLowerCase()) ||
    cmd.shortcut?.toLowerCase().includes(query.toLowerCase())
  )

  if (!paletteOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none" onClick={() => setPaletteOpen(false)}>
      <div className="pointer-events-auto w-full max-w-2xl animate-scale-in">
        <div className="bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-line">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted size-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Escribe un comando o busca..."
                className="w-full pl-10 pr-4 py-3 bg-surface-elevated border border-line rounded-xl text-text placeholder:text-text-muted focus-ring text-lg"
                autoFocus
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-text-muted bg-surface rounded border border-line">⌘K</kbd>
            </div>
          </div>
          <div className="max-h-96 overflow-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-text-muted">No se encontraron comandos</div>
            ) : (
              <ul role="listbox" aria-label="Comandos">
                {filteredCommands.map((cmd, i) => (
                  <li
                    key={cmd.id}
                    role="option"
                    aria-selected={i === selectedIndex}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                      i === selectedIndex ? 'bg-accent/10 text-accent' : 'hover:bg-surface-elevated'
                    )}
                    onClick={() => { cmd.action(); setPaletteOpen(false) }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <cmd.icon size={20} className="flex-shrink-0 w-5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text truncate">{cmd.label}</p>
                      <p className="text-sm text-text-muted truncate">{cmd.desc}</p>
                    </div>
                    {cmd.shortcut && <kbd className="px-2 py-0.5 text-xs text-text-muted bg-surface rounded border border-line font-mono">{cmd.shortcut}</kbd>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-text-muted mt-2">⌘K para abrir · Esc para cerrar</p>
      </div>
    </div>
  )
}