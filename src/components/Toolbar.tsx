import { useStore, useVisibleItems } from '@/store/useStore'
import { useAppStore } from '@/store/useAppStore'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Tooltip } from './ui/Tooltip'
import { cn } from '@/lib/utils'
import { Plus, Search, Filter, List, Grid, Download, RotateCcw, Trash2, ChevronDown, X } from 'lucide-react'
import { CONSOLE_BY_ID } from '@shared/consoles'

export function Toolbar() {
  const {
    statusFilter,
    setStatusFilter,
    consoleFilter,
    setConsoleFilter,
    search,
    setSearch,
    sort,
    setSort,
    groupByDay,
    setPref,
    selectedIds,
    clearSelection,
    selectAll,
    visibleIds,
    openDialog
  } = useStore()

  const visible = useVisibleItems()
  const route = useAppStore(s => s.route)

  const statusOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Activas' },
    { value: 'downloading', label: 'Descargando' },
    { value: 'queued', label: 'En cola' },
    { value: 'completed', label: 'Completadas' },
    { value: 'paused', label: 'Pausadas' },
    { value: 'error', label: 'Error' },
    { value: 'decomp', label: 'Descomprimir' }
  ] as const

  const sortOptions = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'added', label: 'Orden de agregado' },
    { value: 'name', label: 'Nombre' },
    { value: 'status', label: 'Estado' },
    { value: 'console', label: 'Consola' },
    { value: 'size', label: 'Tamaño' }
  ] as const

  const consoleOptions = [
    { value: '', label: 'Todas las consolas' },
    ...Object.values(CONSOLE_BY_ID).map(c => ({ value: c.id, label: c.name }))
  ]

  if (route !== '/descargas') {
    return (
      <div className="h-12 px-4 border-b border-line flex items-center gap-4">
        <h1 className="text-lg font-semibold text-text flex-1">
          {NAV_LABELS[route as keyof typeof NAV_LABELS] || route}
        </h1>
        <div className="flex items-center gap-2">
          <Tooltip content="Añadir descarga" position="bottom">
            <Button variant="primary" size="sm" onClick={() => openDialog({ kind: 'add' })}><Plus size={16} /> Añadir</Button>
          </Tooltip>
        </div>
      </div>
    )
  }

  return (
    <div className="h-12 px-4 border-b border-line flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[200px] max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted size-4" />
        <input
          type="search"
          placeholder="Buscar descargas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-surface border border-line rounded-lg text-text placeholder:text-text-muted focus-ring text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Filtrar por estado" position="bottom">
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            options={statusOptions}
            className="w-[140px]"
          />
        </Tooltip>

        <Tooltip content="Filtrar por consola" position="bottom">
          <Select
            value={consoleFilter || ''}
            onChange={e => setConsoleFilter(e.target.value || null)}
            options={consoleOptions}
            className="w-[160px]"
          />
        </Tooltip>

        <Tooltip content="Ordenar" position="bottom">
          <Select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            options={sortOptions}
            className="w-[150px]"
          />
        </Tooltip>

        <Tooltip content={groupByDay ? 'Desagrupar por día' : 'Agrupar por día'} position="bottom">
          <Button variant="ghost" size="sm" onClick={() => setPref('groupByDay', !groupByDay)} className={cn(groupByDay && 'bg-accent/10 text-accent')}>
            <List size={16} />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-lg px-3 py-1">
            <span className="text-sm font-medium text-accent">{selectedIds.length} seleccionadas</span>
            <Button variant="ghost" size="sm" onClick={clearSelection}><X size={14} /></Button>
          </div>
        )}
        <Tooltip content="Añadir descarga" position="bottom">
          <Button variant="primary" size="sm" onClick={() => openDialog({ kind: 'add' })}><Plus size={16} /> Añadir</Button>
        </Tooltip>
      </div>
    </div>
  )
}

const NAV_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/diagnostico': 'Diagnóstico',
  '/estructura': 'Estructura',
  '/watcher': 'Watcher',
  '/monitor': 'Monitor',
  '/explorador': 'Explorador',
  '/biblioteca': 'Biblioteca',
  '/bigbox': 'BigBox',
  '/ajustes': 'Ajustes'
}