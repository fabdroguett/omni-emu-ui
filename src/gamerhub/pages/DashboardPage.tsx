import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatBytes } from '@/lib/utils'
import { Gamepad2, HardDrive, Database, Activity, Monitor, Box, Wrench, Settings, Download, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const QUICK_ACTIONS = [
  { label: 'Escanear biblioteca', icon: Database, action: () => useAppStore.getState().refreshDrives() },
  { label: 'Ver descargas', icon: Download, action: () => useAppStore.getState().setRoute('/descargas') },
  { label: 'Configurar watcher', icon: Activity, action: () => useAppStore.getState().setRoute('/watcher') },
  { label: 'Abrir ajustes', icon: Settings, action: () => useAppStore.getState().setRoute('/ajustes') }
]

const STATS_CARDS = [
  { label: 'Juegos totales', value: '3,874', icon: Gamepad2, color: '#7c5cff' },
  { label: 'Tamaño biblioteca', value: '1.2 TB', icon: HardDrive, color: '#22c55e' },
  { label: 'Consolas', value: '24', icon: Box, color: '#f59e0b' },
  { label: 'Descargas activas', value: '3', icon: Download, color: '#3b82f6' }
]

export function DashboardPage() {
  const { config, drives, selectedDrive } = useAppStore()
  const profile = config ? useAppStore.getState().profile() : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">Visión general de tu biblioteca y estado del sistema</p>
        </div>
        <div className="flex gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, action }) => (
            <Button key={label} variant="secondary" size="sm" onClick={action}><Icon size={16} /> {label}</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} variant="elevated">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text tabular-nums">{value}</p>
                <p className="text-sm text-text-muted">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado de la SD / Dispositivo</CardTitle>
            <CardDescription>Unidad seleccionada y espacio disponible</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDrive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive size={24} className="text-accent" />
                    <div>
                      <p className="font-medium text-text">{selectedDrive.label || selectedDrive.stableId}</p>
                      <p className="text-sm text-text-muted">{selectedDrive.type === 'sd' ? 'Tarjeta SD' : 'Disco externo'}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="md" dot>Conectado</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-text-muted">Espacio libre</p><p className="font-mono text-text tabular-nums">{formatBytes(0)}</p></div>
                  <div><p className="text-text-muted">Capacidad total</p><p className="font-mono text-text tabular-nums">{formatBytes(0)}</p></div>
                  <div><p className="text-text-muted">Sistema de archivos</p><p className="font-mono text-text">exFAT</p></div>
                  <div><p className="text-text-muted">Esquema carpetas</p><p className="font-mono text-text">ES-DE</p></div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <HardDrive size={48} className="mx-auto mb-4 opacity-30" />
                <p>No hay dispositivo seleccionado</p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => useAppStore.getState().setRoute('/explorador')}>
                  Seleccionar dispositivo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Última actividad</CardTitle>
            <CardDescription>Eventos recientes del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, color: '#22c55e', text: 'Escaneo de biblioteca completado', time: 'hace 2 min' },
                { icon: Download, color: '#3b82f6', text: 'Descarga completada: Zelda OOT', time: 'hace 15 min' },
                { icon: Activity, color: '#f59e0b', text: 'Watcher detectó 5 archivos nuevos', time: 'hace 1 hora' },
                { icon: AlertCircle, color: '#ef4444', text: 'Error en descarga: Mario Kart 64', time: 'hace 3 horas' }
              ].map(({ icon: Icon, color, text, time }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text">{text}</p>
                    <p className="text-xs text-text-muted">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Acceso rápido</CardTitle>
          <CardDescription>Navega directamente a las secciones principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { route: '/biblioteca', label: 'Biblioteca', icon: Gamepad2, desc: 'Ver todos tus juegos', color: '#7c5cff' },
              { route: '/explorador', label: 'Explorador', icon: HardDrive, desc: 'Navegar archivos en SD', color: '#22c55e' },
              { route: '/diagnostico', label: 'Diagnóstico', icon: Activity, desc: 'Verificar integridad', color: '#f59e0b' },
              { route: '/watcher', label: 'Watcher', icon: Database, desc: 'Automatizar transferencias', color: '#3b82f6' },
              { route: '/monitor', label: 'Monitor', icon: Monitor, desc: 'Rendimiento y logs', color: '#a855f7' },
              { route: '/estructura', label: 'Estructura', icon: Box, desc: 'Organizar carpetas', color: '#ec4899' },
              { route: '/bigbox', label: 'BigBox', icon: Wrench, desc: 'Emuladores y frontend', color: '#14b8a6' },
              { route: '/ajustes', label: 'Ajustes', icon: Settings, desc: 'Configuración global', color: '#64748b' }
            ].map(({ route, label, icon: Icon, desc, color }) => (
              <Button
                key={route}
                variant="outline"
                className={cn('h-24 flex-col items-start justify-center text-left gap-2', 'hover:border-accent/50 hover:bg-accent/5')}
                onClick={() => useAppStore.getState().setRoute(route)}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <span className="font-medium text-text">{label}</span>
                <span className="text-xs text-text-muted">{desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}