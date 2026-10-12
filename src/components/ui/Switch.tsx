import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <label className={cn('flex items-start gap-3 cursor-pointer', className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="peer h-5 w-5 appearance-none rounded-full border-2 border-line bg-surface transition-all duration-200
              checked:border-accent checked:bg-accent
              focus-ring
              disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white transform transition-transform
            peer-checked:translate-x-1.5" />
        </div>
        {(label || description) && (
          <div className="pt-0.5">
            {label && <span className="text-sm font-medium text-text">{label}</span>}
            {description && <span className="block text-xs text-text-muted mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    )
  }
)
Switch.displayName = 'Switch'