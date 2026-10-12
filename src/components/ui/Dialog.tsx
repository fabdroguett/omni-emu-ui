import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
}

export function Dialog({ open, onOpenChange, title, description, children, size = 'md', showClose = true }: DialogProps) {
  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onOpenChange(false)
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={() => onOpenChange(false)} />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full animate-scale-in',
          'bg-surface border border-line rounded-2xl shadow-2xl',
          sizes[size],
          size === 'full' ? 'max-h-[90vh] overflow-hidden' : 'max-h-[85vh] overflow-hidden'
        )}
        onKeyDown={handleKeyDown}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between p-4 border-b border-line">
            <div>
              {title && <DialogPrimitive.Title className="text-lg font-semibold text-text">{title}</DialogPrimitive.Title>}
              {description && <DialogPrimitive.Description className="mt-1 text-sm text-text-muted">{description}</DialogPrimitive.Description>}
            </div>
            {showClose && (
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} aria-label="Cerrar">
                <X size={18} />
              </Button>
            )}
          </div>
        )}
        <div className={cn('p-4', size === 'full' ? 'overflow-auto' : 'overflow-auto')}>
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
  return children
}

export function DialogClose({ children }: { children: React.ReactElement }) {
  return children
}