import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-accent text-white hover:bg-accent-hover active:bg-accent/80',
      secondary: 'bg-surface-elevated text-text hover:bg-surface-elevated/80 border border-line',
      outline: 'bg-transparent border border-line text-text hover:bg-surface',
      ghost: 'bg-transparent text-text hover:bg-surface',
      danger: 'bg-error text-white hover:bg-error/90'
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-3 text-base rounded-xl gap-2'
    }
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="animate-spin">⏳</span>}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'