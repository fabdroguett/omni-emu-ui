import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<number>()
  const childRef = useRef<HTMLElement>(null)

  const show = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay)
  }
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  useEffect(() => {
    const el = childRef.current
    if (!el) return
    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
    el.addEventListener('focus', show)
    el.addEventListener('blur', hide)
    return () => {
      el.removeEventListener('mouseenter', show)
      el.removeEventListener('mouseleave', hide)
      el.removeEventListener('focus', show)
      el.removeEventListener('blur', hide)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [delay])

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-text-muted',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-text-muted',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-text-muted',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-text-muted'
  }

  const clonedChild = React.cloneElement(children, {
    ref: childRef,
    'aria-describedby': visible ? 'tooltip-content' : undefined
  })

  return (
    <>
      {clonedChild}
      {visible && (
        <div
          id="tooltip-content"
          role="tooltip"
          className={cn(
            'fixed z-50 px-2.5 py-1.5 text-xs font-medium text-text bg-surface-elevated border border-line rounded-lg shadow-lg animate-fade-in',
            'pointer-events-none',
            positions[position]
          )}
        >
          {content}
          <div className={cn('absolute w-0 h-0 border-4 border-transparent', arrows[position])} />
        </div>
      )}
    </>
  )
}