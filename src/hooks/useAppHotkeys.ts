import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { useAppStore } from '@/store/useAppStore'

export function useAppHotkeys() {
  const { openDialog, closeDialog, setPaletteOpen, paletteOpen, clearSelection, selectAll, items, statusFilter } = useStore()
  const { setRoute, sidebarCollapsed, patchConfig } = useAppStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        if (e.key === 'Escape') {
          closeDialog()
          setPaletteOpen(false)
        }
        return
      }

      const isMac = navigator.platform.includes('Mac')
      const mod = isMac ? e.metaKey : e.ctrlKey

      // Global shortcuts
      if (mod && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(!paletteOpen)
        return
      }
      if (mod && e.key === 'n') {
        e.preventDefault()
        openDialog({ kind: 'add' })
        return
      }
      if (mod && e.key === 'i') {
        e.preventDefault()
        openDialog({ kind: 'import' })
        return
      }
      if (mod && e.key === 'g') {
        e.preventDefault()
        openDialog({ kind: 'grabber' })
        return
      }
      if (mod && e.key === ',') {
        e.preventDefault()
        openDialog({ kind: 'settings' })
        return
      }
      if (mod && e.key === 'l') {
        e.preventDefault()
        setRoute('/biblioteca')
        return
      }
      if (mod && e.key === 'd') {
        e.preventDefault()
        setRoute('/')
        return
      }
      if (mod && e.key === 'b') {
        e.preventDefault()
        patchConfig({ global: { sidebarCollapsed: !sidebarCollapsed } })
        return
      }
      if (mod && e.key === '/') {
        e.preventDefault()
        openDialog({ kind: 'shortcuts' })
        return
      }
      if (mod && e.shiftKey && e.key === 's') {
        e.preventDefault()
        openDialog({ kind: 'stats' })
        return
      }

      // Escape closes dialogs/palette
      if (e.key === 'Escape') {
        closeDialog()
        setPaletteOpen(false)
        return
      }

      // List shortcuts (only on downloads page)
      const route = useAppStore.getState().route
      if (route === '/descargas') {
        if (mod && e.key === 'a') {
          e.preventDefault()
          const visibleIds = items.filter(i => matchesStatus(i, statusFilter)).map(i => i.id)
          selectAll(visibleIds)
          return
        }
        if (e.key === 'Escape') {
          clearSelection()
          return
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
          const selectedIds = useStore.getState().selectedIds
          if (selectedIds.length) {
            e.preventDefault()
            useStore.getState().removeSelected()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [paletteOpen, closeDialog, setPaletteOpen, openDialog, clearSelection, selectAll, items, statusFilter, setRoute, sidebarCollapsed, patchConfig])
}

function matchesStatus(item: { status: string }, f: string): boolean {
  const ACTIVE = ['connecting', 'downloading', 'processing']
  switch (f) {
    case 'all': return true
    case 'active': return ACTIVE.includes(item.status)
    case 'queued': return item.status === 'queued'
    case 'decomp': return item.status === 'completed' && false
    default: return item.status === f
  }
}