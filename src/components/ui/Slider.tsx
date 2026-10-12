import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  valueLabel?: (value: number) => string
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, min = 0, max = 100, step = 1, showValue = true, valueLabel, ...props }, ref) => {
    const sliderId = label?.toLowerCase().replace(/\s+/g, '-')
    const value = props.value || props.defaultValue || min
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={sliderId} className="text-sm font-medium text-text">{label}</label>
            {showValue && (
              <span className="text-sm text-text-muted font-mono tabular-nums">
                {valueLabel ? valueLabel(value) : value}
              </span>
            )}
          </div>
        )}
        <div className="relative h-6">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            step={step}
            className={cn(
              'w-full h-2 appearance-none bg-line rounded-full',
              'focus-ring outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-accent',
              '[&::-webkit-slider-thumb]:border-2',
              '[&::-webkit-slider-thumb]:border-white',
              '[&::-webkit-slider-thumb]:shadow-md',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-accent',
              '[&::-moz-range-thumb]:border-2',
              '[&::-moz-range-thumb]:border-white',
              className
            )}
            style={{
              background: `linear-gradient(to right, var(--color-accent) ${percentage}%, var(--color-line) ${percentage}%)`
            } as React.CSSProperties}
            {...props}
          />
        </div>
      </div>
    )
  }
)
Slider.displayName = 'Slider'