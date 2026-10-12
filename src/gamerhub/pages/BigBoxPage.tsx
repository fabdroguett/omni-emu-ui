import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'
import { Gamepad2, Play, Settings, Cpu, Monitor, Tv, Wrench, ChevronRight, Plus, Edit, Trash2, Download, Box, Zap } from 'lucide-react'

const MOCK_EMULATORS = [
  { id: '1', system: 'n64', name: 'Mupen64Plus', path: 'C:\\Emulators\\mupen64plus\\mupen64plus.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'default' },
  { id: '2', system: 'gba', name: 'mGBA', path: 'C:\\Emulators\\mgba\\mgba.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'quality' },
  { id: '3', system: 'nds', name: 'melonDS', path: 'C:\\Emulators\\melonDS\\melonDS.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'default' },
  { id: '4', system: 'n3ds', name: 'Citra', path: 'C:\\Emulators\\citra\\citra-qt.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'quality' },
  { id: '5', system: 'snes', name: 'Snes9x', path: 'C:\\Emulators\\snes9x\\snes9x.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'default' },
  { id: '6', system: 'psx', name: 'DuckStation', path: 'C:\\Emulators\\duckstation\\duckstation.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'quality' },
  { id: '7', system: 'psp', name: 'PPSSPP', path: 'C:\\Emulators\\ppsspp\\PPSSPPWindows64.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'default' },
  { id: '8', system: 'megadrive', name: 'BlastEm', path: 'C:\\Emulators\\blastem\\blastem.exe', args: '"{rom}"', enabled: true, profiles: ['default', 'performance', 'quality'], activeProfile: 'default' }
]

const FRONTENDS = [
  { id: 'daijisho', name: 'Daijishō', desc: 'Frontend moderno para Android/PC', installed: true },
  { id: 'esde', name: 'ES-DE', desc: 'EmulationStation Desktop Edition', installed: false },
  { id: 'retroarch', name: 'RetroArch', desc: 'Frontend multiplataforma con cores', installed: true }
]

export function BigBoxPage() {
  const [activeTab, setActiveTab] = useState<'emulators' | 'frontends' | 'profiles'>('emulators')
  const [showAddEmulator, setShowAddEmulator] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">BigBox</h1>
          <p className="text-text-muted mt-1">Emuladores, perfiles de calidad y frontends</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddEmulator(true)}><Plus size={16} /> Añadir emulador</Button>
      </div>

      <div className="border-b border-line">
        <nav className="flex gap-1 px-1" role="tablist">
          {[
            { id: 'emulators', label: 'Emuladores', icon: Gamepad2 },
            { id: 'frontends', label: 'Frontends', icon: Tv },
            { id: 'profiles', label: 'Perfiles de calidad', icon: Cpu }
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

      {activeTab === 'emulators' && (
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-surface/50">
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Sistema</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Emulador</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Ruta</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Perfil activo</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted">Estado</th>
                    <th className="px-4 py-3 text-sm font-medium text-text-muted"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {MOCK_EMULATORS.map((emu, i) => (
                    <tr key={i} className="hover:bg-surface-elevated/50">
                      <td className="px-4 py-3">
                        <Badge variant="accent" size="sm">{emu.system.toUpperCase()}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-text">{emu.name}</td>
                      <td className="px-4 py-3 text-sm text-text-muted font-mono max-w-[250px] truncate">{emu.path}</td>
                      <td className="px-4 py-3">
                        <select className="px-2 py-1 bg-surface border border-line rounded text-text text-sm" value={emu.activeProfile} onChange={e => console.log(emu.id, e.target.value)}>
                          {emu.profiles.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={emu.enabled ? 'success' : 'default'} size="sm" dot>{emu.enabled ? 'Activo' : 'Inactivo'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm"><Play size={14} /> Probar</Button>
                        <Button variant="ghost" size="sm"><Settings size={14} /></Button>
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

      {activeTab === 'frontends' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FRONTENDS.map((fe, i) => (
            <Card key={i} variant="elevated">
              <CardContent className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Tv size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-text">{fe.name}</p>
                    <p className="text-sm text-text-muted">{fe.desc}</p>
                  </div>
                </div>
                <Badge variant={fe.installed ? 'success' : 'default'} size="sm" dot>{fe.installed ? 'Instalado' : 'No instalado'}</Badge>
              </CardContent>
              <CardContent className="flex items-center justify-end gap-2 pt-0">
                <Button variant="secondary" size="sm"><Settings size={14} /> Configurar</Button>
                {fe.installed && <Button variant="primary" size="sm"><Play size={14} /> Lanzar</Button>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'profiles' && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Perfiles de calidad predefinidos</CardTitle>
            <CardDescription>Cada perfil define resolución, filtros, shaders y opciones de rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'performance', name: 'Rendimiento', desc: 'Máxima velocidad, calidad mínima', icon: Zap, color: '#22c55e', settings: ['1x resolución', 'Sin filtros', 'VSync off', 'Audio 128ms'] },
                { id: 'default', name: 'Equilibrado', desc: 'Buen balance velocidad/calidad', icon: Cpu, color: '#3b82f6', settings: ['1x resolución', 'Bilineal', 'VSync on', 'Audio 64ms'] },
                { id: 'quality', name: 'Calidad', desc: 'Máxima calidad visual', icon: Monitor, color: '#a855f7', settings: ['3x resolución', 'Anisotrópico 16x', 'VSync on', 'Audio 32ms'] }
              ].map((profile, i) => (
                <Card key={i} variant="outlined" className="h-full">
                  <CardContent className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${profile.color}20` }}>
                        <profile.icon size={24} style={{ color: profile.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-text">{profile.name}</p>
                        <p className="text-sm text-text-muted">{profile.desc}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {profile.settings.map((s, si) => (
                        <li key={si} className="flex items-center gap-2 text-sm text-text-muted">
                          <span className="w-4 h-4 rounded border border-line flex items-center justify-center text-[10px] text-accent">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="mt-4" style={{ borderColor: profile.color, color: profile.color }}>Seleccionar</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showAddEmulator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddEmulator(false)}>
          <div className="bg-surface border border-line rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-line flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Añadir emulador</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddEmulator(false)}>✕</Button>
            </div>
            <div className="p-4 space-y-4">
              <Input label="Sistema" placeholder="n64, gba, nds..." />
              <Input label="Nombre" placeholder="mGBA, Citra, DuckStation..." />
              <Input label="Ejecutable" placeholder="C:\\Emulators\\mgba\\mgba.exe" />
              <Input label="Argumentos" placeholder='"{rom}"' defaultValue='"{rom}"' />
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Activo</span>
                <Switch checked={true} onChange={() => {}} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={() => setShowAddEmulator(false)}>Cancelar</Button>
                <Button variant="primary">Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}