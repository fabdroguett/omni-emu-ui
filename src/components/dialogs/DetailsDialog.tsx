import { useStore } from '@/store/useStore'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'
import { X, Trash2, RotateCcw, Download, Info, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react'

export function DetailsDialog() {
  const { dialog, closeDialog, items } = useStore()
  if (dialog?.kind !== 'details') return null
  const item = items.find(i => i.id === dialog.id)
  if (!item) return null

  const consoleColors: Record<string, string> = {
    n64: '#22c55e', gba: '#6366f1', nds: '#94a3b8', n3ds: '#ef4444',
    snes: '#8b5cf6', psx: '#facc15', psp: '#1e293b'
  }

  return (
    <Dialog open={true} onOpenChange={closeDialog} title={item.rom.title || item.filename} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface rounded-xl border border-line">
            <p className="text-sm text-text-muted">Estado</p>
            <p className="font-mono text-lg text-text mt-1 capitalize">{item.status}</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-line">
            <p className="text-sm text-text-muted">Progreso</p>
            <p className="font-mono text-lg text-text mt-1">{item.size > 0 ? Math.round((item.downloaded / item.size) * 100) : 0}%</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-line">
            <p className="text-sm text-text-muted">Velocidad</p>
            <p className="font-mono text-lg text-text mt-1">{item.speed > 0 ? (item.speed / 1024 / 1024).toFixed(2) + ' MB/s' : '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface rounded-xl border border-line">
            <h4 className="font-medium text-text mb-3">Información del archivo</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-text-muted">Nombre</dt><dd className="text-text font-mono truncate max-w-[200px]">{item.filename}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Tamaño</dt><dd className="text-text">{(item.size / 1024 / 1024).toFixed(2)} MB</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Descargado</dt><dd className="text-text">{(item.downloaded / 1024 / 1024).toFixed(2)} MB</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Consola</dt><dd className="text-text">{item.consoleId.toUpperCase()}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Origen</dt><dd className="text-text capitalize">{item.source}</dd></div>
              <div className="flex justify-between"><dt className="text-text-muted">Añadido</dt><dd className="text-text">{new Date(item.createdAt).toLocaleString()}</dd></div>
              {item.completedAt && <div className="flex justify-between"><dt className="text-text-muted">Completado</dt><dd className="text-text">{new Date(item.completedAt).toLocaleString()}</dd></div>}
              {item.error && <div className="flex justify-between"><dt className="text-error">Error</dt><dd className="text-error">{item.error}</dd></div>}
            </dl>
          </div>

          <div className="p-4 bg-surface rounded-xl border border-line">
            <h4 className="font-medium text-text mb-3">Acciones</h4>
            <div className="space-y-2">
              {item.status === 'downloading' && <Button variant="secondary" className="w-full" onClick={() => useStore.getState().pauseDownload(item.id)}><RotateCcw size={16} /> Pausar</Button>}
              {item.status === 'paused' && <Button variant="primary" className="w-full" onClick={() => useStore.getState().resumeDownload(item.id)}><Download size={16} /> Reanudar</Button>}
              {item.status === 'error' && <Button variant="primary" className="w-full" onClick={() => useStore.getState().retryDownload(item.id)}><RotateCcw size={16} /> Reintentar</Button>}
              {(item.status === 'completed' || item.status === 'paused' || item.status === 'error') && (
                <Button variant="danger" className="w-full" onClick={() => { useStore.getState().removeDownload(item.id); closeDialog() }}><Trash2 size={16} /> Eliminar de la lista</Button>
              )}
            </div>
          </div>
        </div>

        {item.url && (
          <div className="p-4 bg-surface rounded-xl border border-line">
            <h4 className="font-medium text-text mb-3">URL original</h4>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline break-all flex items-center gap-2">
              <ExternalLink size={14} /> {item.url}
            </a>
          </div>
        )}
      </div>
    </Dialog>
  )
}
