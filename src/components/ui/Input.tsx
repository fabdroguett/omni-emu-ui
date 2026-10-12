import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-text-muted mb-1.5">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 bg-surface border border-line rounded-lg text-text placeholder:text-text-muted',
            'focus-ring transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:ring-error',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error" role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-text-muted">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-text-muted mb-1.5">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 bg-surface border border-line rounded-lg text-text placeholder:text-text-muted',
            'focus-ring transition-colors resize-y min-h-[80px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:ring-error',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error" role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-text-muted">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'