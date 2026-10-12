import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'
  size?: 'sm' | 'md'
  dot?: boolean
}

export function Badge({ className, variant = 'default', size = 'md', dot, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-elevated text-text-muted border border-line',
    success: 'bg-success/15 text-success border border-success/30',
    warning: 'bg-warning/15 text-warning border border-warning/30',
    error: 'bg-error/15 text-error border border-error/30',
    info: 'bg-info/15 text-info border border-info/30',
    accent: 'bg-accent/15 text-accent border border-accent/30'
  }
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5'
  }
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'downloading' | 'queued' | 'completed' | 'paused' | 'error' | 'connecting' | 'processing'
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config: Record<string, { label: string; variant: BadgeProps['variant']; dot: boolean }> = {
    downloading: { label: 'Descargando', variant: 'info', dot: true },
    queued: { label: 'En cola', variant: 'default', dot: false },
    completed: { label: 'Completado', variant: 'success', dot: true },
    paused: { label: 'Pausado', variant: 'warning', dot: false },
    error: { label: 'Error', variant: 'error', dot: false },
    connecting: { label: 'Conectando', variant: 'info', dot: true },
    processing: { label: 'Procesando', variant: 'accent', dot: true }
  }
  const { label, variant, dot } = config[status] || config.queued
  return <Badge variant={variant} size={size} dot={dot}>{label}</Badge>
}