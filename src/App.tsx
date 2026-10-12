import { lazy, Suspense, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { FileDown } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useStore } from '@/store/useStore'
import { useAppStore } from '@/store/useAppStore'
import { Background } from '@/components/Background'
import { CommandPalette } from '@/components/CommandPalette'
import { AddDialog } from '@/components/dialogs/AddDialog'
import { SettingsDialog } from '@/components/dialogs/SettingsDialog'
import { DetailsDialog } from '@/components/dialogs/DetailsDialog'
import { AppShell } from '@/app/AppShell'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { initTheme } from '@/lib/theme'

// Lazy load heavy components
const StatsDialog = lazy(() => import('@/components/dialogs/StatsDialog').then(m => ({ default: m.StatsDialog })))
const GamerHubSection = lazy(() => import('@/gamerhub/GamerHubSection').then(m => ({ default: m.GamerHubSection })))

let cannon: confetti.CreateTypes | null = null

function celebrate() {
  if (!useStore.getState().celebrate) return
  if (!cannon) {
    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '80' })
    document.body.appendChild(canvas)
    cannon = confetti.create(canvas, { resize: true, useWorker: false, disableForReducedMotion: true })
  }
  const colors = ['#22d3ee', '#a3e635', '#f472b6', '#e6ebf5']
  const base = { particleCount: 70, spread: 62, startVelocity: 48, ticks: 180, scalar: 0.9, colors }
  cannon({ ...base, angle: 60, origin: { x: 0, y: 0.95 } })
  cannon({ ...base, angle: 120, origin: { x: 1, y: 0.95 } })
}

export default function App() {
  const { init, dispose, ready, dialog, openDialog, refreshLibrary, refreshDats } = useStore()
  const { initialise, subscribe } = useAppStore()
  const [startupError, setStartupError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    let alive = true
    const initAll = async () => {
      try {
        await init()
        await initialise()
        subscribe()
      } catch (error) {
        if (alive) setStartupError(error instanceof Error ? error.message : String(error))
      }
    }
    initAll()

    // Mock clipboard/events listeners
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const files = Array.from(e.dataTransfer.files)
      const text = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list')
      const urls = text.split('\n').map(u => u.trim()).filter(Boolean)
      if (urls.length) openDialog({ kind: 'add', urls })
      else if (files.length) toast.info('Arrastra archivos al backend real para importar')
    }

    window.addEventListener('drop', handleDrop)
    window.addEventListener('dragover', e => { e.preventDefault(); setDragging(true) })
    window.addEventListener('dragleave', e => { if (e.currentTarget === e.target) setDragging(false) })

    return () => {
      alive = false
      dispose()
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('dragover', e => { e.preventDefault(); setDragging(true) })
      window.removeEventListener('dragleave', e => { if (e.currentTarget === e.target) setDragging(false) })
    }
  }, [init, dispose, initialise, subscribe, openDialog])

  if (!ready) return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-bg px-8 text-center">
      <FileDown size={32} className="text-accent" />
      <p role={startupError ? 'alert' : 'status'} className="text-sm text-muted">{startupError ?? 'Cargando…'}</p>
      {startupError && <button className="focus-ring rounded-lg border border-line px-4 py-2 text-sm mt-2" onClick={() => location.reload()}>Reintentar</button>}
    </div>
  )

  return (
    <>
      <Background />
      <AppShell>
        <div
          className="relative h-full"
          onDragOver={e => { e.preventDefault(); if (!dragging) setDragging(true) }}
          onDragLeave={e => { if (e.currentTarget === e.target) setDragging(false) }}
          onDrop={handleDrop}
        >
          <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted">Cargando…</div>}>
            <GamerHubSection />
          </Suspense>

          <CommandPalette />
          {dialog?.kind === 'add' && <AddDialog initialUrls={dialog.urls} />}
          {dialog?.kind === 'settings' && <SettingsDialog initialTab={dialog.tab} />}
          {dialog?.kind === 'details' && <DetailsDialog />}
          {dialog?.kind === 'stats' && (
            <Suspense fallback={null}>
              <StatsDialog />
            </Suspense>
          )}

          {dragging && (
            <div className="pointer-events-none absolute inset-0 z-30 flex animate-fade-in items-center justify-center bg-bg/70 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-accent/60 bg-surface/80 px-8 py-6 text-sm shadow-2xl shadow-accent/10">
                <FileDown size={22} className="text-accent" /> Arrastra URLs, .txt con enlaces o archivos .dat
              </div>
            </div>
          )}
        </div>
      </AppShell>
      <Toaster theme="dark" position="bottom-right" richColors closeButton offset={44} toastOptions={{ className: 'font-sans' }} />
    </>
  )
}

import { useState } from 'react'

function handleDrop(e: DragEvent) {
  e.preventDefault()
}