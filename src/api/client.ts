const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const WS_BASE = import.meta.env.VITE_WS_BASE || 'ws://localhost:8080'

interface DownloadItem {
  id: string
  url: string
  finalUrl: string | null
  filename: string
  dir: string
  size: number
  downloaded: number
  status: string
  segments: any[]
  resumable: boolean
  connections: number
  speed: number
  eta: number
  error: string | null
  createdAt: number
  completedAt: number | null
  headers: Record<string, string>
  consoleId: string
  consoleLocked: boolean
  rom: any
  finalPath: string | null
  extractedFiles: string[]
  hashes: any | null
  processingStep: string | null
  etag: string | null
  verification: any | null
  note: string | null
  source: string
  localFiles: string[]
  originalPaths: string[]
  send: any | null
}

interface Settings {
  libraryRoot: string
  otherDownloadsDir: string
  organizeByConsole: boolean
  folderStyle: string
  extractArchives: boolean
  deleteArchiveAfterExtract: boolean
  computeHashes: boolean
  skipExisting: boolean
  onExistingFile: string
  renameToDat: boolean
  renameToCatalogName: boolean
  onQueueDone: string
  maxConnections: number
  maxConcurrent: number
  speedLimit: number
  retries: number
  userAgent: string
  clipboardMonitor: boolean
  notifications: boolean
  minimizeToTray: boolean
  bridgeEnabled: boolean
  bridgePort: number
  bridgeToken: string
  watchEnabled: boolean
  watchFolders: string[]
  watchSettleSeconds: number
  sendTelegramAuto: boolean
  sendToKind: string
  sendToEnabled: boolean
  sendToRoot: string
  sendToMtpDevice: string
  sendToMtpPath: string
  sendToVolumeId: string | null
  sendToFolderStyle: string
  sendToAuto: boolean
  downloadThenGameHub: boolean
  sendOnlyRoms: boolean
  verifyCopies: boolean
  autoOrganize: boolean
  autoOrganizeCleanup: boolean
  sendToAutoRepair: boolean
  auditFolders: string[]
  cleanNames: boolean
  azaharPrepare: boolean
  azaharCompress: boolean
  azaharTrim: boolean
  azaharKeysPath: string
  archivePasswords: string[]
  floatingWindow: boolean
  floatingOnlyActive: boolean
  floatingSticky: boolean
  floatingShowRecent: boolean
  floatingShowExtractProgress: boolean
  floatingBounds: any | null
  fallbackToBrowser: boolean
  accentColor: string
  accentRgbMode: string
  accentRgbSpeed: number
  deviceProfiles: any[]
}

interface AddRequest {
  url: string
  filename?: string
  dir?: string
  connections?: number
  headers?: Record<string, string>
  consoleId?: string
  autoStart?: boolean
  sendToGameHub?: boolean
}

interface LibraryEntry {
  consoleId: string
  folder: string
  files: number
  bytes: number
}

interface DatInfo {
  id: string
  name: string
  version: string
  consoleId: string
  entries: number
  importedAt: number
}

interface SendQueueStatus {
  enabled: boolean
  kind: string
  mtp: any | null
  root: string
  drive: any | null
  resolvedRoot: string | null
  pending: number
  activeId: string | null
  speed: number
}

interface WatcherStatus {
  running: boolean
  sources: number
  queueLength: number
  currentFile: string | null
  speed: number
  lastScan: number
}

interface WatchSourceConfig {
  id: string
  label: string
  path: string
  enabled: boolean
  recursive: boolean
  deleteAfterTransfer: boolean
  deleteWhenAlreadyOnCard: boolean
  autoExtractArchives: boolean
}

interface DriveInfo {
  letter: string
  label: string
  fileSystem: string
  uniqueId: string
  free: number
  size: number
  removable: boolean
}

interface ScrapeResult {
  gameId: string
  title: string
  boxArt?: string
  screenshots?: string[]
  video?: string
  description?: string
  releaseDate?: string
  developer?: string
  publisher?: string
  genre?: string[]
  players?: number
  rating?: string
}

interface EmulatorConfig {
  systemId: string
  executablePath: string
  arguments: string
  enabled: boolean
  qualityProfiles: any[]
  activeQualityProfile: string
}

interface EmulatorLaunchConfig {
  emulatorPath: string
  arguments: string
  systemId: string
  romPath: string
  qualityProfile: string
}

class ApiClient {
  private ws: WebSocket | null = null
  private wsHandlers: Map<string, (data: unknown) => void> = new Map()
  private reconnectTimeout: number | null = null

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`${res.status} ${res.statusText}: ${text}`)
    }
    if (res.status === 204) return undefined as T
    return res.json()
  }

  getDownloads() { return this.request<DownloadItem[]>('/api/downloads') }
  addDownload(req: AddRequest) { return this.request<DownloadItem>('/api/downloads', { method: 'POST', body: JSON.stringify(req) }) }
  pauseDownload(id: string) { return this.request<void>(`/api/downloads/${id}/pause`, { method: 'POST' }) }
  resumeDownload(id: string) { return this.request<void>(`/api/downloads/${id}/resume`, { method: 'POST' }) }
  cancelDownload(id: string) { return this.request<void>(`/api/downloads/${id}/cancel`, { method: 'POST' }) }
  removeDownload(id: string, deleteFile = false) { return this.request<void>(`/api/downloads/${id}?deleteFile=${deleteFile}`, { method: 'DELETE' }) }
  retryDownload(id: string) { return this.request<void>(`/api/downloads/${id}/retry`, { method: 'POST' }) }
  setDownloadSpeedLimit(id: string, limit: number) { return this.request<void>(`/api/downloads/${id}/speed`, { method: 'POST', body: JSON.stringify({ limit }) }) }

  getSettings() { return this.request<Settings>('/api/settings') }
  updateSettings(patch: Partial<Settings>) { return this.request<Settings>('/api/settings', { method: 'PATCH', body: JSON.stringify(patch) }) }

  getLibrary() { return this.request<LibraryEntry[]>('/api/library') }
  scanLibrary() { return this.request<LibraryEntry[]>('/api/library/scan', { method: 'POST' }) }

  getDats() { return this.request<DatInfo[]>('/api/dats') }
  importDat(file: File) {
    const form = new FormData()
    form.append('file', file)
    return this.request<DatInfo>('/api/dats/import', { method: 'POST', body: form, headers: {} })
  }

  getSendStatus() { return this.request<SendQueueStatus>('/api/send/status') }
  enableSend(enabled: boolean) { return this.request<void>('/api/send/enable', { method: 'POST', body: JSON.stringify({ enabled }) }) }
  retrySend(id: string) { return this.request<void>(`/api/send/${id}/retry`, { method: 'POST' }) }

  getWatcherStatus() { return this.request<WatcherStatus>('/api/watcher/status') }
  startWatcher() { return this.request<void>('/api/watcher/start', { method: 'POST' }) }
  stopWatcher() { return this.request<void>('/api/watcher/stop', { method: 'POST' }) }
  getWatcherSources() { return this.request<WatchSourceConfig[]>('/api/watcher/sources') }
  addWatcherSource(source: Omit<WatchSourceConfig, 'id'>) { return this.request<WatchSourceConfig>('/api/watcher/sources', { method: 'POST', body: JSON.stringify(source) }) }
  removeWatcherSource(id: string) { return this.request<void>(`/api/watcher/sources/${id}`, { method: 'DELETE' }) }

  getDrives() { return this.request<DriveInfo[]>('/api/drives') }

  scrapeGame(systemId: string, gameName: string) { return this.request<ScrapeResult>('/api/scraper/scrape', { method: 'POST', body: JSON.stringify({ systemId, gameName }) }) }

  getEmulators() { return this.request<EmulatorConfig[]>('/api/emulators') }
  launchGame(config: EmulatorLaunchConfig) { return this.request<void>('/api/emulators/launch', { method: 'POST', body: JSON.stringify(config) }) }

  connectWS(onOpen?: () => void, onClose?: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) { resolve(); return }
      this.ws = new WebSocket(`${WS_BASE}/ws`)
      this.ws.onopen = () => { onOpen?.(); resolve() }
      this.ws.onclose = () => { onClose?.(); this.scheduleReconnect() }
      this.ws.onerror = (e) => reject(e)
      this.ws.onmessage = (msg) => {
        try {
          const { type, payload } = JSON.parse(msg.data)
          this.wsHandlers.get(type)?.(payload)
        } catch {}
      }
    })
  }

  disconnectWS() {
    if (this.reconnectTimeout) { clearTimeout(this.reconnectTimeout); this.reconnectTimeout = null }
    this.ws?.close()
    this.ws = null
  }

  on<T>(event: string, handler: (data: T) => void) {
    this.wsHandlers.set(event, handler as (data: unknown) => void)
  }

  off(event: string) {
    this.wsHandlers.delete(event)
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null
      this.connectWS().catch(() => {})
    }, 3000)
  }
}

export const api = new ApiClient()