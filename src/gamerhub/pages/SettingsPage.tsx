import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Slider } from '@/components/ui/Slider'
import { cn, formatBytes } from '@/lib/utils'
import { Settings, Palette, HardDrive, Database, Network, Shield, Bell, Monitor, Gamepad2, Box, Wrench, Save, RotateCcw, Download, Trash2, Upload } from 'lucide-react'

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'downloads', label: 'Descargas', icon: Download },
  { id: 'library', label: 'Biblioteca', icon: Box },
  { id: 'transfer', label: 'Transferencia', icon: HardDrive },
  { id: 'watcher', label: 'Watcher', icon: Database },
  { id: 'network', label: 'Red', icon: Network },
  { id: 'emulators', label: 'Emuladores', icon: Gamepad2 },
  { id: 'advanced', label: 'Avanzado', icon: Wrench }
] as const

export function SettingsPage() {
  const { config, patchConfig, patchProfile } = useAppStore()
  const [activeTab, setActiveTab] = useState<TABS[number]['id']>('general')
  const global = config?.global

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Ajustes</h1>
          <p className="text-text-muted mt-1">Configura OmniEmu a tu gusto</p>
        </div>
        <Button variant="primary" onClick={() => patchConfig({ global: { ...global, onboardingCompleted: true } })}><Save size={16} /> Guardar todo</Button>
      </div>

      <div className="flex gap-4">
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  'hover:bg-surface-elevated',
                  activeTab === id ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <Card variant="elevated">
            <CardContent className="p-6 max-w-3xl">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Experiencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {[
                        { id: 'gamer', name: 'Jugador', desc: 'Biblioteca grande, lanzamiento rápido', theme: 'dark', accent: '#7c5cff', density: 'comfortable' },
                        { id: 'collector', name: 'Coleccionista', desc: 'DATs, auditoría, metadatos', theme: 'dark', accent: '#f59e0b', density: 'compact' },
                        { id: 'developer', name: 'Desarrollador', desc: 'Logs, consola, depuración', theme: 'dark', accent: '#22d3ee', density: 'compact' },
                        { id: 'custom', name: 'Personalizado', desc: 'Tu configuración a medida', theme: 'system', accent: '#7c5cff', density: 'comfortable' }
                      ].map(exp => (
                        <button
                          key={exp.id}
                          onClick={() => patchConfig({ global: { experience: exp.id, theme: exp.theme, accentColor: exp.accent, density: exp.density } })}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            global?.experience === exp.id
                              ? 'border-accent bg-accent/5'
                              : 'border-line hover:border-accent/50'
                          )}
                        >
                          <div className="w-3 h-3 rounded-full mb-2" style={{ background: exp.accent }} />
                          <p className="font-medium text-text">{exp.name}</p>
                          <p className="text-xs text-text-muted mt-1">{exp.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Entorno</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['pc', 'handheld'].map(env => (
                        <button
                          key={env}
                          onClick={() => patchConfig({ global: { environment: env } })}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            global?.environment === env
                              ? 'border-accent bg-accent/5'
                              : 'border-line hover:border-accent/50'
                          )}
                        >
                          <p className="font-medium text-text capitalize">{env}</p>
                          <p className="text-xs text-text-muted mt-1">{env === 'pc' ? 'PC de sobremesa' : 'Portátil / Handheld'}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Idioma</h3>
                    <Select
                      value={global?.language || 'es'}
                      onChange={e => patchConfig({ global: { language: e.target.value } })}
                      options={[{ value: 'es', label: 'Español' }, { value: 'en', label: 'English' }]}
                      className="w-[200px]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Tema</h3>
                    <Select
                      value={global?.theme || 'dark'}
                      onChange={e => patchConfig({ global: { theme: e.target.value } })}
                      options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }, { value: 'system', label: 'Sistema' }]}
                      className="w-[200px]"
                    />
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Color de acento</h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={global?.accentColor || '#7c5cff'}
                        onChange={e => patchConfig({ global: { accentColor: e.target.value } })}
                        className="w-12 h-12 rounded-lg border border-line cursor-pointer"
                      />
                      <Input
                        value={global?.accentColor || '#7c5cff'}
                        onChange={e => patchConfig({ global: { accentColor: e.target.value } })}
                        placeholder="#7c5cff"
                        className="w-[150px]"
                      />
                      <div className="flex gap-2">
                        {['#7c5cff', '#f59e0b', '#22d3ee', '#ef4444', '#22c55e', '#a855f7', '#ec4899', '#f43f5e'].map(c => (
                          <button
                            key={c}
                            onClick={() => patchConfig({ global: { accentColor: c } })}
                            className={cn(
                              'w-8 h-8 rounded-lg border-2 transition-transform',
                              global?.accentColor === c ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
                            )}
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Densidad</h3>
                    <Select
                      value={global?.density || 'comfortable'}
                      onChange={e => patchConfig({ global: { density: e.target.value } })}
                      options={[{ value: 'compact', label: 'Compacta' }, { value: 'comfortable', label: 'Confortable' }, { value: 'spacious', label: 'Espaciosa' }]}
                      className="w-[200px]"
                    />
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Modo RGB (próximamente)</h3>
                    <Select
                      value="static"
                      onChange={() => {}}
                      options={[{ value: 'static', label: 'Estático' }, { value: 'rainbow', label: 'Arcoíris' }, { value: 'breathing', label: 'Respiración' }, { value: 'reactive', label: 'Reactivo' }]}
                      className="w-[200px]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'downloads' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Comportamiento</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Extraer archivos automáticamente</p><p className="text-sm text-text-muted">Descomprime .zip/.7z/.rar al finalizar</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Eliminar archivo comprimido tras extraer</p></div>
                        <Switch checked={false} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Calcular hashes (CRC32, MD5, SHA1)</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Saltarse archivos ya existentes</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Límites</h3>
                    <div className="space-y-4">
                      <Slider label="Máx. descargas simultáneas" min={1} max={10} step={1} defaultValue={3} showValue />
                      <Slider label="Conexiones por descarga" min={1} max={16} step={1} defaultValue={4} showValue />
                      <Slider label="Límite de velocidad global (MB/s, 0 = ilimitado)" min={0} max={100} step={1} defaultValue={0} showValue valueLabel={v => v === 0 ? 'Ilimitado' : `${v} MB/s`} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Carpetas</h3>
                    <div className="space-y-3">
                      <Input label="Carpeta de descargas" placeholder="D:\\Descargas" defaultValue="D:\\Descargas" />
                      <Input label="Carpeta de biblioteca" placeholder="D:\\ROMs" defaultValue="D:\\ROMs" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'library' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Organización</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Organizar por consola</p><p className="text-sm text-text-muted">Crea subcarpetas por sistema</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Estilo de carpetas</p></div>
                        <Select value="esde" onChange={() => {}} options={[{ value: 'name', label: 'Nintendo - Game Boy Advance' }, { value: 'esde', label: 'gba (ES-DE)' }]} className="w-[250px]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Renombrar según DAT verificado</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Limpieza de nombres</p><p className="text-sm text-text-muted">Elimina acentos y símbolos</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Auto-organizar (próximamente)</h3>
                    <div className="space-y-4 text-text-muted">
                      <p>Esta función moverá archivos automáticamente a sus carpetas correspondientes.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transfer' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Destino</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Tipo de destino</p></div>
                        <Select value="drive" onChange={() => {}} options={[{ value: 'drive', label: 'Unidad (SD/Disco)' }, { value: 'mtp', label: 'MTP (Teléfono)' }]} className="w-[250px]" />
                      </div>
                      <Input label="Carpeta raíz en destino" placeholder="F:\\ROMs" defaultValue="F:\\ROMs" />
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Auto-enviar al terminar descarga</p></div>
                        <Switch checked={false} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Solo enviar ROMs (no manuales/covers)</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Verificar copias (hash)</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Reparación automática</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Re-enviar archivos faltantes al conectar</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'watcher' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">General</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Watcher activado</p></div>
                        <Switch checked={false} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Modo simulación (dry-run)</p><p className="text-sm text-text-muted">Solo registra sin copiar</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Extraer archivos automáticamente</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Rendimiento</h3>
                    <div className="space-y-4">
                      <Slider label="Concurrencia de transferencias" min={1} max={8} step={1} defaultValue={1} showValue />
                      <Slider label="Tamaño de lote" min={0} max={1000} step={25} defaultValue={25} showValue valueLabel={v => v === 0 ? 'Sin límite' : String(v)} />
                      <Slider label="Intervalo de re-escaneo (min)" min={0} max={1440} step={5} defaultValue={15} showValue valueLabel={v => v === 0 ? 'Desactivado' : `${v} min`} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Puente del navegador</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Habilitar puente</p><p className="text-sm text-text-muted">Permite capturar descargas desde el navegador</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <Input label="Puerto" type="number" defaultValue={8080} className="w-[120px]" />
                      <Input label="Token compartido (opcional)" placeholder="Dejar vacío para sin autenticación" className="w-[300px]" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">User Agent</h3>
                    <Input label="User Agent personalizado" placeholder="Mozilla/5.0..." defaultValue="Mozilla/5.0 (Windows NT 10.0; Win64; x64) OmniEmu/1.0 Safari/537.36" />
                  </div>
                </div>
              )}

              {activeTab === 'emulators' && (
                <div className="space-y-4 text-center py-8 text-text-muted">
                  <Gamepad2 size={48} className="mx-auto mb-4 opacity-30" />
                  <p>La configuración de emuladores se gestiona en la pestaña <strong>BigBox</strong>.</p>
                  <Button variant="secondary" className="mt-4" onClick={() => useAppStore.getState().setRoute('/bigbox')}><Gamepad2 size={16} /> Ir a BigBox</Button>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-text mb-4">Notificaciones</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Notificaciones nativas</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Solo notificar transferencias grandes</p></div>
                        <Switch checked={false} onChange={() => {}} />
                      </div>
                      <Slider label="Umbral (MB)" min={1} max={2048} step={64} defaultValue={512} showValue valueLabel={v => `${v} MB`} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Ventana flotante</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Mostrar ventana flotante</p></div>
                        <Switch checked={false} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Solo cuando hay actividad</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Siempre encima (sticky)</p></div>
                        <Switch checked={true} onChange={() => {}} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Actualizaciones</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-text">Comprobar actualizaciones automáticamente</p></div>
                        <Switch checked={false} onChange={() => {}} />
                      </div>
                      <Button variant="secondary" size="sm"><RotateCcw size={14} /> Comprobar ahora</Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line">
                    <h3 className="font-medium text-text mb-4">Datos</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-text-muted">Directorio de datos: <code className="font-mono">%APPDATA%\\OmniEmu</code></p>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm"><Trash2 size={14} /> Limpiar caché</Button>
                        <Button variant="secondary" size="sm"><Download size={14} /> Exportar configuración</Button>
                        <Button variant="secondary" size="sm"><Upload size={14} /> Importar configuración</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Upload } from 'lucide-react'