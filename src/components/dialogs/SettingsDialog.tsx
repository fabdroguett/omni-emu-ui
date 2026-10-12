import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Switch } from '../ui/Switch'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { cn } from '@/lib/utils'
import { X, Save, Palette, HardDrive, Download, Database, Network, Shield, Wrench, Gamepad2 } from 'lucide-react'

const SETTINGS_TABS = [
  { id: 'general', label: 'General', icon: Gamepad2 },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'downloads', label: 'Descargas', icon: Download },
  { id: 'library', label: 'Biblioteca', icon: Database },
  { id: 'transfer', label: 'Transferencia', icon: HardDrive },
  { id: 'network', label: 'Red', icon: Network },
  { id: 'advanced', label: 'Avanzado', icon: Wrench }
] as const

export function SettingsDialog({ initialTab = 'general' }: { initialTab?: string }) {
  const { dialog, closeDialog, setPref, celebrate, relativeTimes, showSelectionToolbar, fallbackToBrowser, sort, groupByDay } = useStore()
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <Dialog open={true} onOpenChange={closeDialog} title="Ajustes" size="xl">
      <div className="flex h-[70vh]">
        <aside className="w-48 border-r border-line flex-shrink-0">
          <nav className="p-2 space-y-1">
            {SETTINGS_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeTab === id ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text hover:bg-surface-elevated'
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-text mb-4">Preferencias de UI</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-text">Animaciones de celebración</p><p className="text-sm text-text-muted">Confetti al completar la cola</p></div>
                    <Switch checked={celebrate} onChange={e => setPref('celebrate', e.target.checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-text">Tiempos relativos</p><p className="text-sm text-text-muted">Mostrar \"hace 5 min\" en lugar de fecha exacta</p></div>
                    <Switch checked={relativeTimes} onChange={e => setPref('relativeTimes', e.target.checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-text">Barra de selección</p><p className="text-sm text-text-muted">Mostrar toolbar al seleccionar items</p></div>
                    <Switch checked={showSelectionToolbar} onChange={e => setPref('showSelectionToolbar', e.target.checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-text">Fallback al navegador</p><p className="text-sm text-text-muted">Si falla la captura, dejar que el navegador descargue</p></div>
                    <Switch checked={fallbackToBrowser} onChange={e => setPref('fallbackToBrowser', e.target.checked)} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-line">
                <h3 className="font-medium text-text mb-4">Orden por defecto</h3>
                <Select
                  value={sort}
                  onChange={e => setPref('sort', e.target.value as typeof sort)}
                  options={[
                    { value: 'recent', label: 'Más recientes primero' },
                    { value: 'added', label: 'Orden de agregado' },
                    { value: 'name', label: 'Por nombre (A-Z)' },
                    { value: 'status', label: 'Por estado' },
                    { value: 'console', label: 'Por consola' },
                    { value: 'size', label: 'Por tamaño' }
                  ]}
                  className="w-[250px]"
                />
              </div>

              <div className="pt-4 border-t border-line">
                <h3 className="font-medium text-text mb-4">Agrupación</h3>
                <div className="flex items-center justify-between">
                  <div><p className="font-medium text-text">Agrupar por día</p><p className="text-sm text-text-muted">Separar descargas por fecha de finalización</p></div>
                  <Switch checked={groupByDay} onChange={e => setPref('groupByDay', e.target.checked)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 text-center py-8 text-text-muted">
              <Palette size={48} className="mx-auto mb-4 opacity-30" />
              <p>La configuración de apariencia (tema, color de acento, densidad) se gestiona en la pestaña <strong>Ajustes</strong> del menú principal (BigBox).</p>
              <Button variant="secondary" className="mt-4" onClick={() => { closeDialog(); useStore.getState().openDialog({ kind: 'settings', tab: 'appearance' }) }}>Ir a Ajustes completos</Button>
            </div>
          )}

          {['downloads', 'library', 'transfer', 'network', 'advanced'].includes(activeTab) && (
            <div className="space-y-6 text-center py-8 text-text-muted">
              <Settings size={48} className="mx-auto mb-4 opacity-30" />
              <p>Esta sección está disponible en la configuración completa.</p>
              <Button variant="secondary" className="mt-4" onClick={() => { closeDialog(); useStore.getState().openDialog({ kind: 'settings', tab: activeTab as any }) }}>Ir a Ajustes completos</Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

import { useState } from 'react'
