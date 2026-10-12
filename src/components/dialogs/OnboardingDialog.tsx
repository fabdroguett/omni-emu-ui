import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronLeft, Gamepad2, HardDrive, Database, Palette, Check } from 'lucide-react'

const STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenido a OmniEmu',
    description: 'Tu gestor de descargas y biblioteca de emulación unificada.',
    icon: Gamepad2
  },
  {
    id: 'environment',
    title: '¿Dónde vas a usar OmniEmu?',
    description: 'Esto adapta la interfaz a tu dispositivo.',
    icon: HardDrive,
    type: 'choice',
    options: [
      { id: 'pc', label: 'PC de sobremesa', desc: 'Teclado, ratón, monitor grande', icon: '🖥️' },
      { id: 'handheld', label: 'Portátil / Handheld', desc: 'Pantalla táctil, controles integrados', icon: '🎮' }
    ]
  },
  {
    id: 'experience',
    title: 'Elige tu experiencia',
    description: 'Define el enfoque principal de la app.',
    icon: Palette,
    type: 'choice',
    options: [
      { id: 'gamer', label: 'Jugador', desc: 'Biblioteca grande, lanzamiento rápido', color: '#7c5cff' },
      { id: 'collector', label: 'Coleccionista', desc: 'DATs, auditoría, metadatos', color: '#f59e0b' },
      { id: 'developer', label: 'Desarrollador', desc: 'Logs, consola, depuración', color: '#22d3ee' }
    ]
  },
  {
    id: 'storage',
    title: '¿Dónde guardas tus ROMs?',
    description: 'Configura tu biblioteca y destino de transferencia.',
    icon: Database,
    type: 'storage'
  },
  {
    id: 'complete',
    title: '¡Listo para empezar!',
    description: 'OmniEmu está configurado. Puedes cambiar cualquier ajuste después.',
    icon: Check
  }
]

export function OnboardingDialog() {
  const { closeDialog, openDialog } = useStore()
  const [step, setStep] = useState(0)
  const [environment, setEnvironment] = useState<'pc' | 'handheld' | null>(null)
  const [experience, setExperience] = useState<'gamer' | 'collector' | 'developer' | null>(null)

  const currentStep = STEPS[step]
  const canNext = step === 1 ? !!environment : step === 2 ? !!experience : true

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else {
      // Save onboarding complete
      closeDialog()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <Dialog open={true} onOpenChange={closeDialog} title="" size="lg" showClose={false}>
      <div className="flex flex-col h-[500px]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  i < step ? 'bg-accent text-white' : i === step ? 'bg-accent/20 text-accent' : 'bg-surface-elevated text-text-muted'
                )}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={cn('w-12 h-0.5 mx-1', i < step ? 'bg-accent' : 'bg-line')} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: `${currentStep.color || '#7c5cff'}20` }}>
              <currentStep.icon size={32} style={{ color: currentStep.color || '#7c5cff' }} />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">{currentStep.title}</h2>
            <p className="text-text-muted mb-8">{currentStep.description}</p>

            {currentStep.type === 'choice' && currentStep.options && (
              <div className="grid grid-cols-1 md:grid-cols-{currentStep.options.length} gap-4">
                {currentStep.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (step === 1) setEnvironment(opt.id as 'pc' | 'handheld')
                      if (step === 2) setExperience(opt.id as 'gamer' | 'collector' | 'developer')
                    }}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all text-left',
                      (step === 1 && environment === opt.id) || (step === 2 && experience === opt.id)
                        ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                        : 'border-line hover:border-accent/50'
                    )}
                  >
                    <span className="text-3xl mb-2 block">{opt.icon}</span>
                    <p className="font-medium text-text">{opt.label}</p>
                    <p className="text-sm text-text-muted mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === 'storage' && (
              <div className="space-y-4 text-left">
                <div className="p-4 bg-surface rounded-xl border border-line">
                  <label className="block text-sm font-medium text-text-muted mb-2">Carpeta de biblioteca</label>
                  <input type="text" defaultValue="D:\\ROMs" className="w-full px-3 py-2 bg-surface-elevated border border-line rounded-lg text-text placeholder:text-text-muted focus-ring" placeholder="D:\\ROMs" />
                </div>
                <div className="p-4 bg-surface rounded-xl border border-line">
                  <label className="block text-sm font-medium text-text-muted mb-2">Carpeta de descargas</label>
                  <input type="text" defaultValue="D:\\Descargas" className="w-full px-3 py-2 bg-surface-elevated border border-line rounded-lg text-text placeholder:text-text-muted focus-ring" placeholder="D:\\Descargas" />
                </div>
                <div className="p-4 bg-surface rounded-xl border border-line">
                  <label className="block text-sm font-medium text-text-muted mb-2">Unidad SD / Destino (opcional)</label>
                  <input type="text" placeholder="F:\\ROMs" className="w-full px-3 py-2 bg-surface-elevated border border-line rounded-lg text-text placeholder:text-text-muted focus-ring" />
                </div>
              </div>
            )}

            {step === STEPS.length - 1 && (
              <div className="space-y-3 text-sm text-text-muted">
                <p>💡 Pulsa <kbd className="px-2 py-0.5 bg-surface rounded border border-line">⌘K</kbd> para la paleta de comandos</p>
                <p>💡 Arrastra URLs o archivos .dat al área de descargas</p>
                <p>💡 La barra lateral se colapsa con <kbd className="px-2 py-0.5 bg-surface rounded border border-line">⌘B</kbd></p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-line flex justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
            <ChevronLeft size={16} /> Atrás
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={!canNext}>
            {step === STEPS.length - 1 ? 'Empezar' : 'Siguiente'} <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
