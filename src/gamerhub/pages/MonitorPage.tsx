import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { cn, formatBytes, formatSpeed, formatDuration } from '@/lib/utils'
import { Monitor, Activity, TrendingUp, HardDrive, Cpu, MemoryStick, Network, Download, RotateCcw, Terminal, AlertCircle, CheckCircle } from 'lucide-react'

const MOCK_LOGS = [
  { time: '14:32:15', level: 'info', message: 'Descarga completada: Zelda OOT (USA).z64' },
  { time: '14:31:42', level: 'info', message: 'Hash verificado: a1b2c3d4e5f6...' },
  { time: '14:30:15', level: 'warn', message: 'Velocidad de descarga inestable detectada' },
  { time: '14:28:33', level: 'info', message: 'Nueva descarga añadida: Mario Kart 64 (USA).z64' },
  { time: '14:25:10', level: 'error', message: 'Error de conexión: timeout en segmento 3' },
  { time: '14:24:55', level: 'info', message: 'Reintentando descarga...' },
  { time: '14:20:00', level: 'info', message: 'Watcher: escaneo completado, 5 archivos nuevos' },
  { time: '14:15:00', level: 'info', message: 'Transferencia a SD completada: 12 archivos' }
]

export function MonitorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'logs' | 'network'>('overview')
  const [autoScroll, setAutoScroll] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Monitor</h1>
          <p className="text-text-muted mt-1">Rendimiento del sistema, red y logs en tiempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} className="w-4 h-4 accent-accent" />
            Auto-scroll
          </label>
          <Button variant="secondary" size="sm"><RotateCcw size={16} /> Actualizar</Button>
        </div>
      </div>

      <div className="border-b border-line">
        <nav className="flex gap-1 px-1" role="tablist">
          {[
            { id: 'overview', label: 'Resumen', icon: Monitor },
            { id: 'performance', label: 'Rendimiento', icon: Activity },
            { id: 'logs', label: 'Logs', icon: Terminal },
            { id: 'network', label: 'Red', icon: Network }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                'hover:bg-surface-elevated',
                activeTab === id ? 'bg-accent/10 text-accent border-b-2 border-accent' : 'text-text-muted'
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><Cpu size={24} className="text-blue-400" /></div>
              <div>
                <p className="text-2xl font-bold text-text tabular-nums">24%</p>
                <p className="text-sm text-text-muted">CPU</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center"><MemoryStick size={24} className="text-green-400" /></div>
              <div>
                <p className="text-2xl font-bold text-text tabular-nums">4.2 GB</p>
                <p className="text-sm text-text-muted">RAM usada</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><HardDrive size={24} className="text-purple-400" /></div>
              <div>
                <p className="text-2xl font-bold text-text tabular-nums">1.2 TB</p>
                <p className="text-sm text-text-muted">Disco usado</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center"><Network size={24} className="text-orange-400" /></div>
              <div>
                <p className="text-2xl font-bold text-text tabular-nums">12.5 MB/s</p>
                <p className="text-sm text-text-muted">Red (descarga)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>CPU por hilo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[12, 8, 15, 5, 22, 18, 30, 10].map((usage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-text-muted">Hilo {i + 1}</span>
                  <Progress value={usage} className="flex-1" showLabel />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Memoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3"><span className="w-24 text-sm text-text-muted">Heap</span><Progress value={65} className="flex-1" showLabel /></div>
              <div className="flex items-center gap-3"><span className="w-24 text-sm text-text-muted">Externa</span><Progress value={42} className="flex-1" showLabel /></div>
              <div className="flex items-center gap-3"><span className="w-24 text-sm text-text-muted">Array buffers</span><Progress value={15} className="flex-1" showLabel /></div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'logs' && (
        <Card variant="elevated" className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>Logs del sistema</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0 font-mono text-sm">
            <div className="p-4 space-y-1">
              {MOCK_LOGS.map((log, i) => (
                <div key={i} className={cn('flex gap-3 px-2 py-1 hover:bg-surface-elevated/50', log.level === 'error' && 'text-error', log.level === 'warn' && 'text-warning')}>
                  <span className="text-text-muted w-20 shrink-0">{log.time}</span>
                  <span className={cn('w-10 shrink-0', log.level === 'info' && 'text-info', log.level === 'warn' && 'text-warning', log.level === 'error' && 'text-error')}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-text break-all">{log.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'network' && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Actividad de red</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Descarga actual</span><div className="font-mono text-text tabular-nums">{formatSpeed(12_500_000)}</div></div>
                <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Subida actual</span><div className="font-mono text-text tabular-nums">{formatSpeed(450_000)}</div></div>
                <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Conexiones activas</span><div className="font-mono text-text tabular-nums">8</div></div>
                <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Total hoy</span><div className="font-mono text-text tabular-nums">{formatBytes(15_000_000_000)}</div></div>
              </div>
              <div className="h-32 bg-surface rounded-lg flex items-center justify-center text-text-muted">
                Gráfico de velocidad de red (placeholder)
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}