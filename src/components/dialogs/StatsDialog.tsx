import { useStore } from '@/store/useStore'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'
import { X, TrendingUp, Download, Clock, ArrowUpRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export function StatsDialog() {
  const { closeDialog, speedHistory, stats, items } = useStore()

  const completedItems = items.filter(i => i.status === 'completed')
  const totalDownloaded = completedItems.reduce((sum, i) => sum + i.size, 0)
  const avgSpeed = completedItems.length > 0
    ? completedItems.reduce((sum, i) => sum + (i.size / Math.max(1, (i.completedAt || 0) - i.createdAt) * 1000), 0) / completedItems.length
    : 0

  const chartData = speedHistory
    .map((speed, i) => ({ time: i, speed: speed / 1024 / 1024 }))
    .slice(-60)

  return (
    <Dialog open={true} onOpenChange={closeDialog} title="Estadísticas" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Velocidad actual" value={stats.totalSpeed > 0 ? (stats.totalSpeed / 1024 / 1024).toFixed(2) + ' MB/s' : '0 MB/s'} icon={TrendingUp} color="#3b82f6" />
          <StatCard label="Descargas activas" value={stats.active} icon={Download} color="#22c55e" />
          <StatCard label="En cola" value={stats.queued} icon={Clock} color="#f59e0b" />
          <StatCard label="Completadas" value={stats.completed} icon={ArrowUpRight} color="#a855f7" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Total descargado" value={formatBytes(totalDownloaded)} icon={Download} color="#7c5cff" />
          <StatCard label="Velocidad media" value={avgSpeed > 0 ? (avgSpeed / 1024 / 1024).toFixed(2) + ' MB/s' : '—'} icon={TrendingUp} color="#ec4899" />
          <StatCard label="Total archivos" value={items.length} icon={Download} color="#14b8a6" />
          <StatCard label="Con error" value={items.filter(i => i.status === 'error').length} icon={Clock} color="#ef4444" />
        </div>

        <div className="pt-4 border-t border-line">
          <h4 className="font-medium text-text mb-4">Velocidad en tiempo real (últimos 60s)</h4>
          <div className="h-48 bg-surface rounded-xl border border-line p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f38" />
                <XAxis dataKey="time" stroke="#8b919a" tick={{ fill: '#8b919a', fontSize: 10 }} tickFormatter={() => ''} />
                <YAxis stroke="#8b919a" tick={{ fill: '#8b919a', fontSize: 10 }} tickFormatter={v => v.toFixed(1) + ' MB/s'} />
                <Tooltip
                  contentStyle={{ background: '#181b20', border: '1px solid #2a2f38', borderRadius: '8px' }}
                  formatter={(v: number) => [v.toFixed(2) + ' MB/s', 'Velocidad']}
                />
                <Area type="monotone" dataKey="speed" stroke="#7c5cff" fillOpacity={1} fill="url(#speedGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-4 border-t border-line flex justify-end">
          <Button variant="primary" onClick={closeDialog}>Cerrar</Button>
        </div>
      </div>
    </Dialog>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }) {
  return (
    <div className="p-4 bg-surface rounded-xl border border-line">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="font-mono text-2xl font-bold text-text mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
