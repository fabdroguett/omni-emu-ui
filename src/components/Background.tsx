import { useStore } from '@/store/useStore'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export function Background() {
  const { route } = useAppStore()
  const celebrate = useStore(s => s.celebrate)

  if (route !== '/descargas') return null

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      {celebrate && (
        <canvas id="confetti-canvas" className="absolute inset-0" style={{ pointerEvents: 'none' }} />
      )}
    </div>
  )
}