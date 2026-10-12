import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/Button'
import { Trash2, RotateCcw, Download, Copy, Check, X } from 'lucide-react'

export function SelectionToolbar() {
  const { selectedIds, clearSelection, removeSelected, items } = useStore()
  const selectedItems = items.filter(i => selectedIds.includes(i.id))
  const canRetry = selectedItems.some(i => i.status === 'error')
  const canResume = selectedItems.some(i => i.status === 'paused' || i.status === 'queued')
  const canPause = selectedItems.some(i => i.status === 'downloading' || i.status === 'connecting' || i.status === 'processing')

  return (
    <div className="border-t border-line bg-accent/5 px-4 py-2 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-accent mr-2">
        {selectedIds.length} seleccionada{selectedIds.length !== 1 ? 's' : ''}
      </span>
      {canPause && (
        <Button variant="secondary" size="sm" onClick={() => selectedItems.forEach(i => useStore.getState().pauseDownload(i.id))}>
          <span className="flex items-center gap-1"><span>⏸</span> Pausar</span>
        </Button>
      )}
      {canResume && (
        <Button variant="secondary" size="sm" onClick={() => selectedItems.forEach(i => useStore.getState().resumeDownload(i.id))}>
          <span className="flex items-center gap-1"><span>▶</span> Reanudar</span>
        </Button>
      )}
      {canRetry && (
        <Button variant="secondary" size="sm" onClick={() => selectedItems.forEach(i => useStore.getState().retryDownload(i.id))}>
          <RotateCcw size={14} /> Reintentar
        </Button>
      )}
      <Button variant="danger" size="sm" onClick={removeSelected}>
        <Trash2 size={14} /> Eliminar
      </Button>
      <Button variant="ghost" size="sm" onClick={clearSelection}>
        <X size={14} /> Cancelar
      </Button>
    </div>
  )
}