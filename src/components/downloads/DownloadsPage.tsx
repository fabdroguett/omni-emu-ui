import { useStore, useVisibleItems, useSelectedItems, useConsoleOptions } from '@/store/useStore'
import { DownloadRow } from './DownloadRow'
import { QueueOverview } from './QueueOverview'
import { ActiveStrip } from './ActiveStrip'
import { SelectionToolbar } from './SelectionToolbar'
import { cn } from '@/lib/utils'

export function DownloadsPage() {
  const { groupByDay, statusFilter, sort, items, ready } = useStore()
  const visibleItems = useVisibleItems()
  const selectedItems = useSelectedItems()
  const consoleOptions = useConsoleOptions()

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-accent text-4xl mb-4">⏳</div>
          <p className="text-text-muted">Cargando descargas...</p>
        </div>
      </div>
    )
  }

  if (visibleItems.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-8">
        <div className="text-6xl opacity-30">📥</div>
        <h2 className="text-xl font-semibold text-text">No hay descargas</h2>
        <p className="text-text-muted max-w-md">
          {statusFilter !== 'all' ? `No hay descargas con el filtro "${statusFilter}"` : 'Añade tu primera descarga para empezar'}
        </p>
      </div>
    )
  }

  // Group by day if enabled
  const grouped = groupByDay
    ? visibleItems.reduce((acc, item) => {
        const date = new Date(item.completedAt || item.createdAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
        if (!acc[date]) acc[date] = []
        acc[date].push(item)
        return acc
      }, {} as Record<string, typeof visibleItems>)
    : null

  return (
    <div className="h-full flex flex-col">
      <ActiveStrip />
      {selectedItems.length > 0 && <SelectionToolbar />}
      <div className="flex-1 overflow-auto">
        {grouped ? (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-6">
              <h3 className="px-2 py-2 text-sm font-medium text-text-muted uppercase tracking-wider border-b border-line">{date}</h3>
              <div className="divide-y divide-line">
                {items.map(item => <DownloadRow key={item.id} item={item} />)}
              </div>
            </div>
          ))
        ) : (
          <div className="divide-y divide-line">
            {visibleItems.map(item => <DownloadRow key={item.id} item={item} />)}
          </div>
        )}
      </div>
      <QueueOverview />
    </div>
  )
}