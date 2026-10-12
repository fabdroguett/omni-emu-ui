import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Progress } from '@/components/ui/Progress'
import { cn, formatBytes, formatSpeed } from '@/lib/utils'
import { Database, Play, Pause, Plus, Trash2, FolderOpen, RotateCcw, Settings, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react'

const MOCK_SOURCES = [
  { id: '1', label: 'Descargas Telegram', path: 'C:\\Users\\User\\Downloads\\Telegram', enabled: true, recursive: true, status: 'idle', filesFound: 23 },
  { id: '2', label: 'Carpeta entrante ROMs', path: 'D:\\Incoming', enabled: true, recursive: true, status: 'scanning', filesFound: 156 },
  { id: '3', label: 'Red compartida', path: '\\\\NAS\\Roms', enabled: false, recursive: true, status: 'offline', filesFound: 0 }
]

const MOCK_QUEUE = [
  { id: '1', name: 'Zelda OOT (USA).z64', source: 'Descargas Telegram', size: 32_000_000, progress: 45, status: 'copying', speed: 2_500_000 },
  { id: '2', name: 'Mario Kart 64 (USA).z64', source: 'Descargas Telegram', size: 24_000_000, progress: 100, status: 'verifying', speed: 0 },
  { id: '3', name: 'Pokemon Emerald (USA).gba', source: 'Carpeta entrante', size: 16_000_000, progress: 0, status: 'waiting', speed: 0 }
]

export function WatcherPage() {
  const { config } = useAppStore()
  const [watcherEnabled, setWatcherEnabled] = useState(config?.watcher?.enabled || false)
  const [dryRun, setDryRun] = useState(config?.watcher?.dryRun || true)
  const [activeTab, setActiveTab] = useState<'sources' | 'queue' | 'settings'>('sources')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Watcher</h1>
          <p className="text-text-muted mt-1">Automatiza la transferencia de ROMs a tu SD</p>
        </div>
        <div className="flex items-center gap-4">
          <Switch
            checked={watcherEnabled}
            onChange={setWatcherEnabled}
            label="Watcher activo"
            description={watcherEnabled ? 'Monitoreando carpetas configuradas' : 'Detenido'}
          />
          <Button variant="primary" onClick={() => setActiveTab('sources')}><Plus size={16} /> Añadir carpeta</Button>
        </div>
      </div>

      <div className="border-b border-line">
        <nav className="flex gap-1 px-1" role="tablist">
          {[
            { id: 'sources', label: 'Fuentes', icon: Database },
            { id: 'queue', label: 'Cola de transferencia', icon: Download },
            { id: 'settings', label: 'Configuración', icon: Settings }
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

      {activeTab === 'sources' && (
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-surface/50">
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Carpeta</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Ruta</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Recursivo</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Estado</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Archivos</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {MOCK_SOURCES.map((src, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/50">
                      <td className="px-4 py-3 font-medium text-text">{src.label}</td>
                      <td className="px-4 py-3 text-sm text-text-muted font-mono max-w-[200px] truncate">{src.path}</td>
                      <td className="px-4 py-3">
                        <Badge variant={src.recursive ? 'success' : 'default'} size="sm">{src.recursive ? 'Sí' : 'No'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {src.status === 'scanning' && <Badge variant="info" size="sm" dot>Escaneando</Badge>}
                        {src.status === 'idle' && <Badge variant="success" size="sm" dot>Activo</Badge>}
                        {src.status === 'offline' && <Badge variant="error" size="sm" dot>Sin conexión</Badge>}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">{src.filesFound}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" disabled={src.status !== 'idle'}><Play size={14} /></Button>
                        <Button variant="ghost" size="sm" disabled={src.status !== 'scanning'}><Pause size={14} /></Button>
                        <Button variant="ghost" size="sm"><RotateCcw size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-error"><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'queue' && (
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-surface/50">
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Archivo</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Origen</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Progreso</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Velocidad</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Estado</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {MOCK_QUEUE.map((item, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/50">
                      <td className="px-4 py-3 font-medium text-text">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-text-muted">{item.source}</td>
                      <td className="px-4 py-3 w-48">
                        <Progress value={item.progress} showLabel />
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted tabular-nums">{formatSpeed(item.speed)}</td>
                      <td className="px-4 py-3">
                        {item.status === 'copying' && <Badge variant="info" size="sm" dot>Copiando</Badge>}
                        {item.status === 'verifying' && <Badge variant="accent" size="sm" dot>Verificando</Badge>}
                        {item.status === 'waiting' && <Badge variant="default" size="sm" dot>En espera</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm"><RotateCcw size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-error"><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Configuración del Watcher</CardTitle>
            <CardDescription>Ajusta el comportamiento de la monitorización automática</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text">Modo simulación (dry-run)</p>
                <p className="text-sm text-text-muted">Solo registra qué se haría sin copiar archivos</p>
              </div>
              <Switch checked={dryRun} onChange={setDryRun} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text">Extraer archivos automáticamente</p>
                <p className="text-sm text-text-muted">Descomprime .zip/.7z/.rar al detectarlos</p>
              </div>
              <Switch checked={true} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text">Eliminar origen tras copiar</p>
                <p className="text-sm text-text-muted">Mueve el archivo en lugar de copiarlo</p>
              </div>
              <Switch checked={false} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text">Verificar contenido (hash)</p>
                <p className="text-sm text-text-muted">Comprueba que el archivo copiado es idéntico</p>
              </div>
              <Switch checked={true} onChange={() => {}} />
            </div>
            <div className="pt-4 border-t border-line">
              <Button variant="primary">Guardar configuración</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}