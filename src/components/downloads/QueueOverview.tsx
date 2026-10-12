import { useStore } from '@/store/useStore'
import { cn, formatBytes, formatSpeed, formatDuration } from '@/lib/utils'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Download, CheckCircle, Clock, AlertCircle, RotateCcw, Trash2 } from 'lucide-react'

export function QueueOverview() {
  const { stats, items } = useStore()

  const queued = items.filter(i => i.status === 'queued').length
  const completed = items.filter(i => i.status === 'completed').length
  const errors = items.filter(i => i.status === 'error').length

  return (
    <div className="border-t border-line bg-surface/50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="font-mono tabular-nums text-text">{stats.active}</span>
            <span className="text-text-muted">activas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="font-mono tabular-nums text-text">{queued}</span>
            <span className="text-text-muted">en cola</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="font-mono tabular-nums text-success">{completed}</span>
            <span className="text-text-muted">completadas</span>
          </div>
          {errors > 0 && (
            <div className="flex items-center gap-2 text-sm text-error">
              <span className="font-mono tabular-nums">{errors}</span>
              <span>con error</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span className="font-mono tabular-nums">{formatSpeed(stats.totalSpeed)}</span>
          <span>velocidad total</span>
        </div>
      </div>
    </div>
  )
}