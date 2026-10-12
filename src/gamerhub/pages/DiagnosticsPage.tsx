import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { cn, formatBytes } from '@/lib/utils'
import { Database, AlertCircle, CheckCircle, RotateCw, Search, Download, Trash2, FileText, Settings } from 'lucide-react'

const MOCK_DATS = [
  { name: 'Nintendo 64 (No-Intro)', console: 'n64', entries: 387, version: '2024-01-15', status: 'ok' },
  { name: 'Game Boy Advance (No-Intro)', console: 'gba', entries: 1542, version: '2024-01-15', status: 'ok' },
  { console: 'nds', name: 'Nintendo DS (No-Intro)', entries: 4892, version: '2024-01-15', status: 'outdated' },
  { console: 'n3ds', name: 'Nintendo 3DS (No-Intro)', entries: 2341, version: '2024-01-15', status: 'ok' },
  { console: 'snes', name: 'Super Nintendo (No-Intro)', entries: 2156, version: '2024-01-15', status: 'ok' },
  { console: 'psx', name: 'PlayStation (Redump)', entries: 4231, version: '2024-01-15', status: 'ok' },
  { console: 'psp', name: 'PSP (Redump)', entries: 1876, version: '2024-01-15', status: 'missing' }
]

export function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<'dats' | 'scan' | 'verify'>('dats')
  const [scanProgress, setScanProgress] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Diagnóstico</h1>
          <p className="text-text-muted mt-1">Verifica la integridad de tu biblioteca con DATs</p>
        </div>
        <Button variant="primary" onClick={() => { setScanProgress(0); const i = setInterval(() => { setScanProgress(p => { if (p >= 100) { clearInterval(i); return 100 } return p + 10 }) }, 200) }}><RotateCw size={16} className="animate-spin" /> Escanear biblioteca</Button>
      </div>

      <div className="border-b border-line">
        <nav className="flex gap-1 px-1" role="tablist">
          {[
            { id: 'dats', label: 'DATs instalados', icon: Database },
            { id: 'scan', label: 'Escanear', icon: Search },
            { id: 'verify', label: 'Verificar', icon: CheckCircle }
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

      {activeTab === 'dats' && (
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-surface/50">
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">DAT</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Consola</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Entradas</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Versión</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Estado</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {MOCK_DATS.map((dat, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/50">
                      <td className="px-4 py-3 font-medium text-text">{dat.name}</td>
                      <td className="px-4 py-3"><Badge variant="accent" size="sm">{dat.console.toUpperCase()}</Badge></td>
                      <td className="px-4 py-3 text-sm text-text-muted tabular-nums">{dat.entries.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-text-muted">{dat.version}</td>
                      <td className="px-4 py-3">
                        {dat.status === 'ok' && <Badge variant="success" size="sm" dot>Actualizado</Badge>}
                        {dat.status === 'outdated' && <Badge variant="warning" size="sm" dot>Desactualizado</Badge>}
                        {dat.status === 'missing' && <Badge variant="error" size="sm" dot>Faltante</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" disabled={dat.status === 'missing'}><Download size={14} /></Button>
                        <Button variant="ghost" size="sm"><RotateCw size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'scan' && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Escanear biblioteca</CardTitle>
            <CardDescription>Busca nuevos archivos, verifica hashes y actualiza la base de datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text">Progreso del escaneo</span>
                <span className="text-sm text-text-muted">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Archivos escaneados</span><div className="font-mono text-text tabular-nums">{scanProgress * 120}</div></div>
              <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Nuevos juegos</span><div className="font-mono text-text tabular-nums">{Math.floor(scanProgress / 10)}</div></div>
              <div className="p-3 bg-surface rounded-lg"><span className="text-text-muted">Errores</span><div className="font-mono text-error tabular-nums">0</div></div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={scanProgress === 0 || scanProgress === 100} onClick={() => setScanProgress(0)}><RotateCw size={16} /> Reiniciar</Button>
              <Button variant="primary" disabled={scanProgress === 100} onClick={() => { const i = setInterval(() => { setScanProgress(p => { if (p >= 100) { clearInterval(i); return 100 } return p + 10 }) }, 200) }}><RotateCw size={16} className={scanProgress > 0 && scanProgress < 100 ? 'animate-spin' : ''} /> {scanProgress === 100 ? 'Completado' : 'Escanear'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'verify' && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Verificar integridad</CardTitle>
            <CardDescription>Comprueba hashes contra DATs y detecta archivos corruptos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { game: 'The Legend of Zelda: Ocarina of Time', console: 'N64', hash: 'SHA1: a1b2c3d4...', status: 'match' },
                { game: 'Super Mario 64', console: 'N64', hash: 'SHA1: e5f6g7h8...', status: 'match' },
                { game: 'Mario Kart 64', console: 'N64', hash: 'SHA1: i9j0k1l2...', status: 'mismatch' },
                { game: 'Pokémon Emerald', console: 'GBA', hash: 'SHA1: m3n4o5p6...', status: 'match' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="accent" size="sm">{item.console}</Badge>
                    <div>
                      <p className="font-medium text-text">{item.game}</p>
                      <p className="text-xs text-text-muted font-mono">{item.hash}</p>
                    </div>
                  </div>
                  {item.status === 'match' ? (
                    <Badge variant="success" size="sm" dot>Hash coincide</Badge>
                  ) : (
                    <Badge variant="error" size="sm" dot>Hash no coincide</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}