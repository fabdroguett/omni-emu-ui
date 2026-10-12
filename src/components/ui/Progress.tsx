import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function Progress({ value, max = 100, className, showLabel = false }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('w-full h-2 bg-line rounded-full overflow-hidden', className)} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
      {showLabel && (
        <div className="absolute right-0 top-0 text-xs text-text-muted font-mono">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}