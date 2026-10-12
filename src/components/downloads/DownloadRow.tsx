import { useStore } from '@/store/useStore'
import { cn, formatBytes, formatSpeed, formatRelativeTime, formatPercent } from '@/lib/utils'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { CONSOLE_BY_ID } from '@shared/consoles'
import { Pause, Play, RotateCcw, Trash2, MoreHorizontal, X, ChevronDown, ChevronUp, ExternalLink, FileDown } from 'lucide-react'

interface DownloadRowProps {
  item: import('@shared/types').DownloadItem
}

export function DownloadRow({ item }: DownloadRowProps) {
  const {
    selectedIds,
    clickSelect,
    setFocusedId,
    openDialog,
    removeSelected
  } = useStore()

  const isSelected = selectedIds.includes(item.id)
  const consoleDef = CONSOLE_BY_ID[item.consoleId]
  const progress = item.size > 0 ? (item.downloaded / item.size) * 100 : 0

  const handleClick = (e: React.MouseEvent) => {
    const mode = e.metaKey || e.ctrlKey ? 'toggle' : e.shiftKey ? 'range' : 'single'
    const visibleIds = useStore.getState().items.filter(i => matchesStatus(i, useStore.getState().statusFilter)).map(i => i.id)
    clickSelect(item.id, mode, visibleIds)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    openDialog({ kind: 'details', id: item.id })
  }

  const getStatusAction = () => {
    switch (item.status) {
      case 'downloading':
      case 'connecting':
      case 'processing':
        return <Button variant="ghost" size="sm" onClick={() => useStore.getState().pauseDownload(item.id)}><Pause size={14} /></Button>
      case 'paused':
      case 'queued':
        return <Button variant="ghost" size="sm" onClick={() => useStore.getState().resumeDownload(item.id)}><Play size={14} /></Button>
      case 'error':
        return <Button variant="ghost" size="sm" onClick={() => useStore.getState().retryDownload(item.id)}><RotateCcw size={14} /></Button>
      case 'completed':
        return item.send?.status === 'waiting' ? (
          <Button variant="ghost" size="sm" onClick={() => useStore.getState().retrySend?.(item.id)}><FileDown size={14} /></Button>
        ) : null
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'grid grid-cols-[48px_1fr_auto] gap-3 px-2 py-3 items-center transition-colors',
        'hover:bg-surface-elevated/50',
        isSelected && 'bg-accent/5 ring-1 ring-accent/20'
      )}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setFocusedId(item.id)}
      onMouseLeave={() => setFocusedId(null)}
      data-id={item.id}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={e => { e.stopPropagation(); clickSelect(item.id, 'toggle', useStore.getState().items.map(i => i.id)) }}
          className="w-4 h-4 accent-accent rounded border-line bg-surface"
        />
      </div>

      <div className="min-w-0" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 truncate">
          <span className={cn('w-6 h-6 rounded flex items-center justify-center text-xs font-medium flex-shrink-0', `bg-${consoleDef.color}/20 text-${consoleDef.color}`)}>
            {consoleDef.esdeFolder.toUpperCase().slice(0, 3)}
          </span>
          <span className="font-medium text-text truncate">{item.rom.title || item.filename}</span>
          <StatusBadge status={item.status} size="sm" />
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            {formatBytes(item.downloaded)} / {formatBytes(item.size)}
          </span>
          {item.status === 'downloading' && (
            <>
              <span className="flex items-center gap-1">
                {formatSpeed(item.speed)}
              </span>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </>
          )}
          {item.status === 'completed' && item.completedAt && (
            <span>Completado {formatRelativeTime(item.completedAt)}</span>
          )}
          {item.error && <span className="text-error">Error: {item.error}</span>}
        </div>

        {item.status === 'downloading' && (
          <div className="mt-2 h-1.5 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {getStatusAction()}
        <Tooltip content="Detalles" position="left">
          <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); openDialog({ kind: 'details', id: item.id })}}><MoreHorizontal size={16} /></Button>
        </Tooltip>
        {(item.status === 'completed' || item.status === 'error' || item.status === 'paused') && (
          <Tooltip content="Eliminar de la lista" position="left">
            <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); useStore.getState().removeDownload(item.id) }} className="text-error hover:text-error"><Trash2 size={16} /></Button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

function matchesStatus(item: import('@shared/types').DownloadItem, f: import('@/store/useStore').StatusFilter): boolean {
  const ACTIVE = ['connecting', 'downloading', 'processing']
  switch (f) {
    case 'all': return true
    case 'active': return ACTIVE.includes(item.status)
    case 'queued': return item.status === 'queued'
    case 'decomp': return item.status === 'completed' && false
    default: return item.status === f
  }
}