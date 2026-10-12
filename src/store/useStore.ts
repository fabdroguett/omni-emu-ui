import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { DownloadItem, DownloadStatus, LibraryEntry, DatInfo, Settings, Stats, SendQueueStatus, ConsoleId } from '@shared/types'
import { CONSOLE_BY_ID } from '@shared/consoles'
import { matchDecomps } from '@shared/decomps'

export type StatusFilter = 'all' | 'active' | 'queued' | 'completed' | 'paused' | 'error' | 'decomp'
export type SortKey = 'recent' | 'added' | 'name' | 'status' | 'console' | 'size'
export type SettingsTab = 'library' | 'transfer' | 'azahar' | 'network' | 'integration' | 'dats' | 'ui'

export type Dialog =
  | { kind: 'add'; urls?: string[] }
  | { kind: 'import'; url?: string }
  | { kind: 'grabber'; text?: string }
  | { kind: 'sorter' }
  | { kind: 'settings'; tab?: SettingsTab }
  | { kind: 'details'; id: string }
  | { kind: 'remove'; ids: string[] }
  | { kind: 'decomps' }
  | { kind: 'reprocess' }
  | { kind: 'audit' }
  | { kind: 'stats' }
  | { kind: 'shortcuts' }
  | null

export type PromptState = { password?: string; conflict?: string }

export interface UiPrefs {
  sort: SortKey
  groupByDay: boolean
  celebrate: boolean
  relativeTimes: boolean
  showSelectionToolbar: boolean
  fallbackToBrowser: boolean
}

const SPEED_HISTORY = 120

interface State extends UiPrefs {
  items: DownloadItem[]
  stats: Stats
  settings: Settings | null
  library: LibraryEntry[]
  dats: DatInfo[]
  sendStatus: SendQueueStatus | null
  speedHistory: number[]
  statusFilter: StatusFilter
  consoleFilter: ConsoleId | null
  search: string
  selectedIds: string[]
  anchorId: string | null
  focusedId: string | null
  revealId: string | null
  dialog: Dialog
  pendingPrompts: number
  paletteOpen: boolean
  ready: boolean
  init: () => Promise<void>
  dispose: () => void
  setStatusFilter: (f: StatusFilter) => void
  setConsoleFilter: (c: ConsoleId | null) => void
  setSearch: (s: string) => void
  setSort: (s: SortKey) => void
  setPref: <K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => void
  resetFilters: () => void
  clickSelect: (id: string, mode: 'single' | 'toggle' | 'range', visibleIds: string[]) => void
  clearSelection: () => void
  selectAll: (visibleIds: string[]) => void
  reveal: (revealId: string | null) => void
  openDialog: (d: Dialog) => void
  closeDialog: () => void
  setPaletteOpen: (open: boolean) => void
  saveSettings: (patch: Partial<Settings>) => Promise<void>
  refreshLibrary: () => Promise<void>
  refreshDats: () => Promise<void>
  setFocusedId: (id: string | null) => void
  setPendingPrompts: (n: number) => void
  removeSelected: () => void
  // Mock actions
  addMockDownload: (item: DownloadItem) => void
  updateMockDownload: (id: string, patch: Partial<DownloadItem>) => void
  removeMockDownload: (id: string) => void
}

const ACTIVE: DownloadStatus[] = ['connecting', 'downloading', 'processing']
const STATUS_ORDER: DownloadStatus[] = ['downloading', 'connecting', 'processing', 'queued', 'paused', 'error', 'completed']

const DEFAULT_UI_PREFS: UiPrefs = {
  sort: 'recent',
  groupByDay: true,
  celebrate: true,
  relativeTimes: true,
  showSelectionToolbar: true,
  fallbackToBrowser: false
}

let sampler: ReturnType<typeof setInterval> | null = null
let initialization: Promise<void> | null = null
let generation = 0
let subscriptions: (() => void)[] = []
let libraryScan: Promise<void> | null = null

// Only persist UI prefs, not the full state
let lastPrefs: string | null = null
const preferenceStorage: StateStorage = {
  getItem: (name) => (lastPrefs = localStorage.getItem(name)),
  setItem: (name, value) => {
    if (value === lastPrefs) return
    localStorage.setItem(name, value)
    lastPrefs = value
  },
  removeItem: (name) => { localStorage.removeItem(name); lastPrefs = null }
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...DEFAULT_UI_PREFS,
      items: [],
      stats: { totalSpeed: 0, active: 0, queued: 0, completed: 0 },
      settings: null,
      library: [],
      dats: [],
      sendStatus: null,
      speedHistory: new Array<number>(SPEED_HISTORY).fill(0),
      statusFilter: 'all',
      consoleFilter: null,
      search: '',
      selectedIds: [],
      anchorId: null,
      focusedId: null,
      revealId: null,
      dialog: null,
      pendingPrompts: 0,
      paletteOpen: false,
      ready: false,

      init: async () => {
        if (initialization) return initialization
        const current = generation
        let receivedItems = false
        let receivedSettings = false
        let receivedSendStatus = false

        // Subscribe to mock API events
        const { mockApi } = await import('@/api')
        if (mockApi) {
          subscriptions.push(mockApi.on('downloads', (items: DownloadItem[]) => {
            receivedItems = true
            const ids = new Set(items.map((i) => i.id))
            set((s) => ({ items, stats: computeStats(items), selectedIds: s.selectedIds.every((id) => ids.has(id)) ? s.selectedIds : s.selectedIds.filter((id) => ids.has(id)) }))
          }))
          subscriptions.push(mockApi.on('settings', (settings: Settings) => {
            receivedSettings = true
            set({ settings })
          }))
          subscriptions.push(mockApi.on('sendStatus', (sendStatus: SendQueueStatus) => {
            receivedSendStatus = true
            set({ sendStatus })
          }))
        }

        initialization = (async () => {
          try {
            const [settings, downloads, library, dats, sendStatus] = await Promise.all([
              mockApi?.getSettings() ?? Promise.resolve(null),
              mockApi?.getDownloads() ?? Promise.resolve([]),
              mockApi?.getLibrary() ?? Promise.resolve([]),
              mockApi?.getDats() ?? Promise.resolve([]),
              mockApi?.getSendStatus() ?? Promise.resolve(null)
            ])
            
            if (current !== generation) return
            
            const items = downloads || []
            set({ 
              ...(!receivedSettings && settings && { settings }),
              ...(!receivedItems && { items, stats: computeStats(items) }),
              ...(!receivedSendStatus && sendStatus && { sendStatus }),
              library: library || [],
              dats: dats || [],
              ready: true 
            })
            
            // Start speed sampler
            if (sampler) clearInterval(sampler)
            sampler = setInterval(() => {
              const { speedHistory, stats } = get()
              const speed = stats.active > 0 ? stats.totalSpeed : 0
              if (speed === 0 && !speedHistory.some((sample) => sample !== 0)) return
              set({ speedHistory: [...speedHistory.slice(1), speed] })
            }, 1000)
          } catch (error) {
            if (current === generation) get().dispose()
            throw error
          }
        })()
        
        return initialization
      },

      dispose: () => {
        generation++
        for (const off of subscriptions) off()
        subscriptions = []
        if (sampler) clearInterval(sampler)
        sampler = null
        initialization = null
        libraryScan = null
      },

      setStatusFilter: (statusFilter) => set({ statusFilter, selectedIds: [] }),
      setConsoleFilter: (consoleFilter) => set({ consoleFilter, selectedIds: [] }),
      setSearch: (search) => set({ search }),
      setSort: (sort) => set({ sort }),
      setPref: (key, value) => set({ [key]: value } as Partial<State>),
      resetFilters: () => set({ statusFilter: 'all', consoleFilter: null, search: '' }),
      setFocusedId: (id) => set({ focusedId: id }),
      setPendingPrompts: (n) => set({ pendingPrompts: n }),

      clickSelect: (id, mode, visibleIds) => {
        const { selectedIds, anchorId } = get()
        if (mode === 'toggle') {
          set({
            selectedIds: selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
            anchorId: id
          })
          return
        }
        if (mode === 'range' && anchorId && visibleIds.includes(anchorId)) {
          const a = visibleIds.indexOf(anchorId)
          const b = visibleIds.indexOf(id)
          const [lo, hi] = a < b ? [a, b] : [b, a]
          set({ selectedIds: visibleIds.slice(lo, hi + 1) })
          return
        }
        set({ selectedIds: [id], anchorId: id })
      },

      clearSelection: () => set({ selectedIds: [], focusedId: null }),
      selectAll: (visibleIds) => set({ selectedIds: visibleIds }),
      
      removeSelected: () => {
        const { selectedIds } = get()
        if (selectedIds.length) set({ dialog: { kind: 'remove', ids: selectedIds } })
      },

      reveal: (revealId) => set({ revealId }),
      openDialog: (dialog) => set({ dialog, paletteOpen: false }),
      closeDialog: () => set({ dialog: null }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),

      saveSettings: async (patch) => {
        const { mockApi } = await import('@/api')
        if (mockApi) {
          const settings = await mockApi.updateSettings(patch)
          set({ settings })
        }
      },

      refreshLibrary: async () => {
        const { mockApi } = await import('@/api')
        if (mockApi) {
          if (libraryScan) return libraryScan
          const current = generation
          const scan = mockApi.scanLibrary().then((library) => {
            if (current === generation) set({ library })
          }).catch(() => undefined).finally(() => {
            if (libraryScan === scan) libraryScan = null
          })
          libraryScan = scan
          return scan
        }
      },

      refreshDats: async () => {
        const { mockApi } = await import('@/api')
        if (mockApi) {
          const current = generation
          const dats = await mockApi.getDats().catch(() => null)
          if (dats && current === generation) set({ dats })
        }
      },

      // Mock actions
      addMockDownload: (item) => set((s) => ({ items: [item, ...s.items], stats: computeStats([item, ...s.items]) })),
      updateMockDownload: (id, patch) => set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, ...patch } : i), stats: computeStats(s.items.map(i => i.id === id ? { ...i, ...patch } : i)) })),
      removeMockDownload: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id), stats: computeStats(s.items.filter(i => i.id !== id)) }))
    }),
    {
      name: 'idm-ui-prefs',
      version: 1,
      storage: createJSONStorage(() => preferenceStorage),
      partialize: (s): UiPrefs => ({ sort: s.sort, groupByDay: s.groupByDay, celebrate: s.celebrate, relativeTimes: s.relativeTimes, showSelectionToolbar: s.showSelectionToolbar, fallbackToBrowser: s.fallbackToBrowser })
    }
  )
)

function computeStats(items: DownloadItem[]): Stats {
  const active = items.filter(i => ACTIVE.includes(i.status)).length
  const queued = items.filter(i => i.status === 'queued').length
  const completed = items.filter(i => i.status === 'completed').length
  const totalSpeed = items.filter(i => i.status === 'downloading').reduce((sum, i) => sum + i.speed, 0)
  return { totalSpeed, active, queued, completed }
}

export function matchesStatus(item: DownloadItem, f: StatusFilter): boolean {
  switch (f) {
    case 'all': return true
    case 'active': return ACTIVE.includes(item.status)
    case 'queued': return item.status === 'queued'
    case 'decomp': return item.status === 'completed' && matchDecomps(item.hashes).length > 0
    default: return item.status === f
  }
}

export function itemTime(item: DownloadItem): number {
  return item.completedAt ?? item.createdAt
}

function compare(a: DownloadItem, b: DownloadItem, sort: SortKey): number {
  switch (sort) {
    case 'recent': return itemTime(b) - itemTime(a)
    case 'name': return (a.rom.title || a.filename).localeCompare(b.rom.title || b.filename, 'es')
    case 'status': return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    case 'console': return CONSOLE_BY_ID[a.consoleId].name.localeCompare(CONSOLE_BY_ID[b.consoleId].name, 'es')
    case 'size': return b.size - a.size
    default: return 0
  }
}

import Fuse from 'fuse.js'
import { useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'

interface SearchDoc {
  id: string
  title: string
  filename: string
  url: string
  serial: string
}

function createItemIndex(items: DownloadItem[]): Fuse<SearchDoc> {
  const docs = items.map((i) => ({
    id: i.id,
    title: i.rom.title,
    filename: i.filename,
    url: i.url,
    serial: [i.identity?.serial, i.azahar?.productCode, i.azahar?.titleId].filter(Boolean).join(' ')
  }))
  return new Fuse(docs, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'filename', weight: 2 },
      { name: 'serial', weight: 2 },
      { name: 'url', weight: 0.5 }
    ],
    threshold: 0.34,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true
  })
}

export function useItemIndex(items: DownloadItem[]): Fuse<SearchDoc> {
  const key = useMemo(() => items.map((i) => `${i.id}\u0001${i.filename}\u0001${i.rom.title}\u0001${i.identity?.serial ?? ''}\u0001${i.url}\u0001${i.azahar?.productCode ?? ''}\u0001${i.azahar?.titleId ?? ''}`).join('\u0002'), [items])
  return useMemo(() => createItemIndex(items), [key])
}

export function useVisibleItems(): DownloadItem[] {
  const items = useStore((s) => s.items)
  const statusFilter = useStore((s) => s.statusFilter)
  const consoleFilter = useStore((s) => s.consoleFilter)
  const sort = useStore((s) => s.sort)
  const rawSearch = useStore((s) => s.search)
  const [search] = useDebounceValue(rawSearch.trim(), 160)
  const index = useItemIndex(items)
  const matched = useMemo(() => (search.length >= 2 ? new Set(index.search(search).map((r) => r.item.id)) : null), [index, search])

  return useMemo(() => {
    const needle = search.toLowerCase()
    const filtered = items.filter((item) => {
      if (!matchesStatus(item, statusFilter)) return false
      if (consoleFilter && item.consoleId !== consoleFilter) return false
      if (matched) return matched.has(item.id)
      if (needle) return `${item.rom.title} ${item.filename}`.toLowerCase().includes(needle)
      return true
    })
    return sort === 'added' ? filtered : filtered.sort((a, b) => compare(a, b, sort))
  }, [items, statusFilter, consoleFilter, matched, search, sort])
}

export function useSelectedItems(): DownloadItem[] {
  const items = useStore((s) => s.items)
  const selectedIds = useStore((s) => s.selectedIds)
  return useMemo(() => {
    const ids = new Set(selectedIds)
    return items.filter((i) => ids.has(i.id))
  }, [items, selectedIds])
}

export function useConsoleOptions(): { value: ConsoleId; label: string; color: string }[] {
  return [
    { value: null as any, label: 'Todas', color: '#64748b' },
    ...Object.values(CONSOLE_BY_ID).map(c => ({ value: c.id, label: c.name, color: c.color }))
  ]
}