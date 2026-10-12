import { useStore } from '@/store/useStore'
import { cn, formatBytes, formatSpeed } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Download, Pause, Play, RotateCcw, Trash2, X } from 'lucide-react'

export function ActiveStrip() {
  const { items, active, setPref } = useStore()
  const activeItems = items.filter(i => ['downloading', 'connecting', 'processing'].includes(i.status))
  const totalSpeed = activeItems.reduce((sum, i) => sum + i.speed, 0)
  const totalProgress = activeItems.reduce((sum, i) => sum + (i.size > 0 ? i.downloaded / i.size : 0), 0)
  const avgProgress = activeItems.length > 0 ? totalProgress / activeItems.length : 0

  if (activeItems.length === 0) return null

  return (
    <div className="border-b border-line bg-surface/50 px-4 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-2 w-48 bg-line rounded-full overflow-hidden flex-shrink-0">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.min(100, avgProgress * 100)}%` }} />
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted min-w-0">
            <span className="font-mono tabular-nums">{formatSpeed(totalSpeed)}</span>
            <span className="text-text">{activeItems.length} activa{activeItems.length !== 1 ? 's' : ''}</span>
            <Badge variant="info" size="sm">{activeItems.filter(i => i.status === 'downloading').length} descargando</Badge>
            <Badge variant="default" size="sm">{activeItems.filter(i => i.status === 'queued').length} en cola</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => activeItems.forEach(i => useStore.getState().pauseDownload(i.id))} disabled={activeItems.every(i => i.status === 'paused')}>
            <Pause size={14} /> Pausar todas
          </Button>
        </div>
      </div>
    </div>
  )
}