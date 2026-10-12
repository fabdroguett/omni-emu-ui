import type { DownloadItem, Settings, LibraryEntry, DatInfo, SendQueueStatus, DriveInfo, WatchSourceConfig, WatcherStatus, ScrapeResult, EmulatorConfig, EmulatorLaunchConfig, TransferJob, WatcherEvent, Route } from '@shared/types'
import type { AppConfig, Profile, GlobalSettings, DeviceProfile, SdSettings, WatcherSettings, DownloadSettings, ScraperSettings, QualityProfile } from '@shared/gamerhub'
import { CONSOLE_BY_ID } from '@shared/consoles'

// Mock data generators
function createMockDownload(id: string, overrides: Partial<DownloadItem> = {}): DownloadItem {
  const consoles = Object.keys(CONSOLE_BY_ID) as Array<keyof typeof CONSOLE_BY_ID>
  const consoleId = overrides.consoleId || consoles[Math.floor(Math.random() * consoles.length)]
  const statuses: DownloadItem['status'][] = ['downloading', 'queued', 'completed', 'paused', 'error', 'connecting', 'processing']
  const status = overrides.status || statuses[Math.floor(Math.random() * statuses.length)]
  const size = overrides.size || Math.floor(Math.random() * 2_000_000_000) + 10_000_000
  const downloaded = status === 'completed' ? size : (status === 'downloading' ? Math.floor(size * Math.random()) : 0)
  
  return {
    id,
    url: `https://example.com/game-${id}.zip`,
    finalUrl: null,
    filename: `game-${id}.zip`,
    dir: '/downloads',
    size,
    downloaded,
    status,
    segments: [],
    resumable: true,
    connections: 4,
    speed: status === 'downloading' ? Math.floor(Math.random() * 5_000_000) + 100_000 : 0,
    eta: status === 'downloading' ? Math.floor((size - downloaded) / (Math.floor(Math.random() * 5_000_000) + 100_000)) : 0,
    error: status === 'error' ? 'Connection timeout' : null,
    createdAt: Date.now() - Math.floor(Math.random() * 86_400_000 * 7),
    completedAt: status === 'completed' ? Date.now() - Math.floor(Math.random() * 86_400_000) : null,
    headers: {},
    consoleId,
    consoleLocked: false,
    rom: { title: `Game ${id}`, regions: ['USA'], languages: ['en'], tags: [], revision: null, isBeta: false, isProto: false, isDemo: false, isHack: false },
    finalPath: status === 'completed' ? `/library/${consoleId}/Game ${id}.zip` : null,
    extractedFiles: [],
    hashes: null,
    processingStep: null,
    etag: null,
    verification: null,
    note: null,
    source: 'web',
    localFiles: [],
    originalPaths: [],
    send: null,
    ...overrides
  }
}

const mockDownloads: DownloadItem[] = Array.from({ length: 25 }, (_, i) => createMockDownload(`dl-${i + 1}`))

const mockSettings: Settings = {
  libraryRoot: '/library',
  otherDownloadsDir: '/downloads/other',
  organizeByConsole: true,
  folderStyle: 'esde',
  extractArchives: true,
  deleteArchiveAfterExtract: false,
  computeHashes: true,
  skipExisting: true,
  onExistingFile: 'ask',
  renameToDat: true,
  renameToCatalogName: true,
  onQueueDone: 'none',
  maxConnections: 4,
  maxConcurrent: 3,
  speedLimit: 0,
  retries: 3,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) OmniEmu/1.0 Safari/537.36',
  clipboardMonitor: false,
  notifications: true,
  minimizeToTray: true,
  bridgeEnabled: true,
  bridgePort: 8080,
  bridgeToken: '',
  watchEnabled: false,
  watchFolders: [],
  watchSettleSeconds: 5,
  sendTelegramAuto: false,
  sendToKind: 'drive',
  sendToEnabled: false,
  sendToRoot: 'F:\\ROMs',
  sendToMtpDevice: '',
  sendToMtpPath: 'Tarjeta SD\\Roms',
  sendToVolumeId: null,
  sendToFolderStyle: 'esde',
  sendToAuto: false,
  downloadThenGameHub: false,
  sendOnlyRoms: true,
  verifyCopies: true,
  autoOrganize: false,
  autoOrganizeCleanup: false,
  sendToAutoRepair: true,
  auditFolders: [],
  cleanNames: true,
  azaharPrepare: true,
  azaharCompress: false,
  azaharTrim: true,
  azaharKeysPath: '',
  archivePasswords: [],
  floatingWindow: false,
  floatingOnlyActive: true,
  floatingSticky: true,
  floatingShowRecent: true,
  floatingShowExtractProgress: true,
  floatingBounds: null,
  fallbackToBrowser: false,
  accentColor: '#7c5cff',
  accentRgbMode: 'static',
  accentRgbSpeed: 1,
  deviceProfiles: []
}

const mockLibrary: LibraryEntry[] = [
  { consoleId: 'n64', folder: '/library/n64', files: 387, bytes: 12_450_000_000 },
  { consoleId: 'gba', folder: '/library/gba', files: 1_245, bytes: 4_200_000_000 },
  { consoleId: 'nds', folder: '/library/nds', files: 892, bytes: 18_900_000_000 },
  { consoleId: 'n3ds', folder: '/library/n3ds', files: 567, bytes: 24_300_000_000 },
  { consoleId: 'snes', folder: '/library/snes', files: 782, bytes: 3_100_000_000 },
  { consoleId: 'gb', folder: '/library/gb', files: 445, bytes: 450_000_000 },
  { consoleId: 'gbc', folder: '/library/gbc', files: 234, bytes: 680_000_000 },
  { consoleId: 'psx', folder: '/library/psx', files: 1_156, bytes: 45_200_000_000 },
  { consoleId: 'psp', folder: '/library/psp', files: 678, bytes: 32_100_000_000 },
  { consoleId: 'megadrive', folder: '/library/megadrive', files: 567, bytes: 2_800_000_000 },
  { consoleId: 'saturn', folder: '/library/saturn', files: 234, bytes: 18_500_000_000 },
  { consoleId: 'dreamcast', folder: '/library/dreamcast', files: 189, bytes: 22_300_000_000 }
]

const mockDats: DatInfo[] = [
  { id: 'no-intro-n64', name: 'Nintendo 64 (No-Intro)', version: '2024-01-15', consoleId: 'n64', entries: 387, importedAt: Date.now() - 86_400_000 * 30 },
  { id: 'no-intro-gba', name: 'Game Boy Advance (No-Intro)', version: '2024-01-15', consoleId: 'gba', entries: 1_542, importedAt: Date.now() - 86_400_000 * 30 },
  { id: 'no-intro-nds', name: 'Nintendo DS (No-Intro)', version: '2024-01-15', consoleId: 'nds', entries: 4_892, importedAt: Date.now() - 86_400_000 * 30 },
  { id: 'no-intro-3ds', name: 'Nintendo 3DS (No-Intro)', version: '2024-01-15', consoleId: 'n3ds', entries: 2_341, importedAt: Date.now() - 86_400_000 * 30 },
  { id: 'no-intro-snes', name: 'Super Nintendo (No-Intro)', version: '2024-01-15', consoleId: 'snes', entries: 2_156, importedAt: Date.now() - 86_400_000 * 30 },
  { id: 'redump-psx', name: 'PlayStation (Redump)', version: '2024-01-15', consoleId: 'psx', entries: 4_231, importedAt: Date.now() - 86_400_000 * 30 },
  { id: 'redump-psp', name: 'PSP (Redump)', version: '2024-01-15', consoleId: 'psp', entries: 1_876, importedAt: Date.now() - 86_400_000 * 30 }
]

const mockSendStatus: SendQueueStatus = {
  enabled: false,
  kind: 'drive',
  mtp: null,
  root: 'F:\\ROMs',
  drive: { letter: 'F', label: 'SDCARD', fileSystem: 'exFAT', uniqueId: 'vol-123', free: 32_000_000_000, size: 128_000_000_000, removable: true },
  resolvedRoot: 'F:\\ROMs',
  pending: 0,
  activeId: null,
  speed: 0
}

const mockDrives: DriveInfo[] = [
  { letter: 'C', label: 'Windows', fileSystem: 'NTFS', uniqueId: 'vol-c', free: 150_000_000_000, size: 500_000_000_000, removable: false },
  { letter: 'D', label: 'Games', fileSystem: 'NTFS', uniqueId: 'vol-d', free: 800_000_000_000, size: 2_000_000_000_000, removable: false },
  { letter: 'F', label: 'SDCARD', fileSystem: 'exFAT', uniqueId: 'vol-123', free: 32_000_000_000, size: 128_000_000_000, removable: true },
  { letter: 'G', label: 'USB Drive', fileSystem: 'exFAT', uniqueId: 'vol-456', free: 15_000_000_000, size: 64_000_000_000, removable: true }
]

const mockWatcherSources: WatchSourceConfig[] = [
  { id: 'ws-1', label: 'Descargas Telegram', path: 'C:\\Users\\User\\Downloads\\Telegram', enabled: true, recursive: true, deleteAfterTransfer: false, deleteWhenAlreadyOnCard: false, autoExtractArchives: true },
  { id: 'ws-2', label: 'Carpeta ROMs entrante', path: 'D:\\Incoming', enabled: true, recursive: true, deleteAfterTransfer: true, deleteWhenAlreadyOnCard: true, autoExtractArchives: true }
]

const mockWatcherStatus: WatcherStatus = {
  running: false,
  sources: mockWatcherSources.length,
  queueLength: 0,
  currentFile: null,
  speed: 0,
  lastScan: Date.now() - 86_400_000 * 2
}

const mockEmulators: EmulatorConfig[] = [
  { systemId: 'n64', executablePath: 'C:\\Emulators\\mupen64plus\\mupen64plus.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'gba', executablePath: 'C:\\Emulators\\mgba\\mgba.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'nds', executablePath: 'C:\\Emulators\\melonDS\\melonDS.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'n3ds', executablePath: 'C:\\Emulators\\citra\\citra-qt.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'snes', executablePath: 'C:\\Emulators\\snes9x\\snes9x.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'psx', executablePath: 'C:\\Emulators\\duckstation\\duckstation.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'psp', executablePath: 'C:\\Emulators\\ppsspp\\PPSSPPWindows64.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'megadrive', executablePath: 'C:\\Emulators\\blastem\\blastem.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'saturn', executablePath: 'C:\\Emulators\\yabause\\yabause.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' },
  { systemId: 'dreamcast', executablePath: 'C:\\Emulators\\flycast\\flycast.exe', arguments: '"{rom}"', enabled: true, qualityProfiles: [], activeQualityProfile: 'default' }
]

const mockConfig: AppConfig = {
  version: 1,
  activeProfileId: 'default',
  profiles: {
    default: {
      id: 'default',
      name: 'Principal',
      sd: { driveLetter: null, autoDetect: true, romsFolderName: 'ROMs', biosFolderName: 'BIOS', folderScheme: 'esde', nominalWriteMbs: null, nominalReadMbs: null, lowSpaceThreshold: 0.1, deviceProfiles: [] },
      watcher: { enabled: false, sources: mockWatcherSources, dryRun: true, hashAlgorithm: 'md5', concurrency: 1, batchSize: 25, rescanIntervalMs: 15 * 60 * 1000, stabilityIntervalMs: 1500, stabilityChecks: 3, bufferSizeBytes: 8 * 1024 * 1024, extensionMap: {}, ignoredExtensions: [], skipKnownHashes: true, warnOnHashChange: true, retryAttempts: 3, retryDelayMs: 5000, minFileBytes: 1024, routeUnknownToUnsorted: true, verifyContent: true, onNotARom: 'skip', onWrongSystem: 'reroute', onPcDisc: 'copy', verifyOnline: true, renameToCatalogName: true, verifyDestination: true, onlineMaxFileBytes: 8 * 1024 * 1024 * 1024, deleteArchiveAfterExtract: false, deleteExtractedFolderAfterTransfer: false },
      downloads: { destinationDir: '/downloads', maxConcurrentDownloads: 3, connectionsPerDownload: 4, globalSpeedLimit: 0, clipboardMonitor: false, autoExtract: true, deleteArchiveAfterExtract: false, savedPasswords: [], organiseByType: true, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) OmniEmu/1.0 Safari/537.36', retryAttempts: 3 },
      scraper: { provider: 'screenscraper', screenscraper: { username: '', password: '', devId: '', devPassword: '' }, thegamesdb: { apiKey: '' }, igdb: { clientId: '', clientSecret: '' }, preferredRegions: ['us', 'eu', 'wor', 'jp'], preferredLanguage: 'es', downloadBoxArt: true, downloadScreenshots: true, downloadVideos: false, autoScrapeOnScan: false, systemIdOverrides: {}, requestsPerMinute: 60 },
      emulators: mockEmulators
    }
  },
  global: {
    theme: 'dark',
    accentColor: '#7c5cff',
    language: 'es',
    experience: 'gamer',
    density: 'comfortable',
    environment: 'pc',
    onboardingCompleted: true,
    minimizeToTray: true,
    closeToTray: true,
    startMinimised: false,
    nativeNotifications: true,
    notifyAboveBytes: 512 * 1024 * 1024,
    autoUpdate: false,
    sidebarCollapsed: false,
    dataDir: ''
  }
}

// Mock API implementation
let downloads = [...mockDownloads]
let settings = { ...mockSettings }
let library = [...mockLibrary]
let dats = [...mockDats]
let sendStatus = { ...mockSendStatus }
let drives = [...mockDrives]
let watcherSources = [...mockWatcherSources]
let watcherStatus = { ...mockWatcherStatus }
let emulators = [...mockEmulators]
let config = { ...mockConfig }

const wsHandlers: Map<string, (data: unknown) => void> = new Map()

export const mockApi = {
  // Simulated delay
  delay: (ms = 100) => new Promise(r => setTimeout(r, ms)),

  // Downloads
  async getDownloads(): Promise<DownloadItem[]> {
    await mockApi.delay(50)
    return [...downloads]
  },
  async addDownload(req: { url: string; filename?: string; dir?: string; connections?: number; headers?: Record<string, string>; consoleId?: string; autoStart?: boolean; sendToGameHub?: boolean }): Promise<DownloadItem> {
    await mockApi.delay(100)
    const item = createMockDownload(`dl-${Date.now()}`, { url: req.url, filename: req.filename || req.url.split('/').pop() || 'download.zip', dir: req.dir, connections: req.connections, consoleId: req.consoleId as DownloadItem['consoleId'], source: 'web' })
    downloads.unshift(item)
    wsHandlers.get('downloads')?.([...downloads])
    return item
  },
  async pauseDownload(id: string): Promise<void> {
    await mockApi.delay(50)
    const d = downloads.find(x => x.id === id)
    if (d && d.status === 'downloading') { d.status = 'paused'; d.speed = 0; wsHandlers.get('downloads')?.([...downloads]) }
  },
  async resumeDownload(id: string): Promise<void> {
    await mockApi.delay(50)
    const d = downloads.find(x => x.id === id)
    if (d && d.status === 'paused') { d.status = 'downloading'; d.speed = Math.floor(Math.random() * 5_000_000) + 100_000; wsHandlers.get('downloads')?.([...downloads]) }
  },
  async cancelDownload(id: string): Promise<void> {
    await mockApi.delay(50)
    const d = downloads.find(x => x.id === id)
    if (d) { d.status = 'queued'; d.speed = 0; d.downloaded = 0; wsHandlers.get('downloads')?.([...downloads]) }
  },
  async removeDownload(id: string, _deleteFile = false): Promise<void> {
    await mockApi.delay(50)
    downloads = downloads.filter(x => x.id !== id)
    wsHandlers.get('downloads')?.([...downloads])
  },
  async retryDownload(id: string): Promise<void> {
    await mockApi.delay(50)
    const d = downloads.find(x => x.id === id)
    if (d && d.status === 'error') { d.status = 'downloading'; d.error = null; d.speed = Math.floor(Math.random() * 5_000_000) + 100_000; wsHandlers.get('downloads')?.([...downloads]) }
  },
  async setDownloadSpeedLimit(id: string, limit: number): Promise<void> {
    await mockApi.delay(50)
    const d = downloads.find(x => x.id === id)
    if (d) { d.speed = limit; wsHandlers.get('downloads')?.([...downloads]) }
  },

  // Settings
  async getSettings(): Promise<Settings> {
    await mockApi.delay(30)
    return { ...settings }
  },
  async updateSettings(patch: Partial<Settings>): Promise<Settings> {
    await mockApi.delay(50)
    settings = { ...settings, ...patch }
    wsHandlers.get('settings')?.(settings)
    return { ...settings }
  },

  // Library
  async getLibrary(): Promise<LibraryEntry[]> {
    await mockApi.delay(50)
    return [...library]
  },
  async scanLibrary(): Promise<LibraryEntry[]> {
    await mockApi.delay(500)
    // Simulate some changes
    library = library.map(l => ({ ...l, files: l.files + Math.floor(Math.random() * 3) - 1, bytes: l.bytes + Math.floor(Math.random() * 100_000_000) - 50_000_000 }))
    wsHandlers.get('library')?.([...library])
    return [...library]
  },

  // Dats
  async getDats(): Promise<DatInfo[]> {
    await mockApi.delay(30)
    return [...dats]
  },
  async importDat(_file: File): Promise<DatInfo> {
    await mockApi.delay(200)
    const consoles = Object.keys(CONSOLE_BY_ID) as Array<keyof typeof CONSOLE_BY_ID>
    const consoleId = consoles[Math.floor(Math.random() * consoles.length)]
    const newDat: DatInfo = { id: `dat-${Date.now()}`, name: `DAT importado ${new Date().toLocaleDateString()}`, version: new Date().toISOString().split('T')[0], consoleId, entries: Math.floor(Math.random() * 5000) + 100, importedAt: Date.now() }
    dats.push(newDat)
    wsHandlers.get('dats')?.([...dats])
    return newDat
  },

  // Send queue
  async getSendStatus(): Promise<SendQueueStatus> {
    await mockApi.delay(30)
    return { ...sendStatus }
  },
  async enableSend(enabled: boolean): Promise<void> {
    await mockApi.delay(50)
    sendStatus = { ...sendStatus, enabled }
    wsHandlers.get('sendStatus')?.(sendStatus)
  },
  async retrySend(id: string): Promise<void> {
    await mockApi.delay(50)
    console.log('Retry send:', id)
  },

  // Watcher
  async getWatcherStatus(): Promise<WatcherStatus> {
    await mockApi.delay(30)
    return { ...watcherStatus }
  },
  async startWatcher(): Promise<void> {
    await mockApi.delay(100)
    watcherStatus = { ...watcherStatus, running: true }
    wsHandlers.get('watcherStatus')?.(watcherStatus)
  },
  async stopWatcher(): Promise<void> {
    await mockApi.delay(50)
    watcherStatus = { ...watcherStatus, running: false }
    wsHandlers.get('watcherStatus')?.(watcherStatus)
  },
  async getWatcherSources(): Promise<WatchSourceConfig[]> {
    await mockApi.delay(30)
    return [...watcherSources]
  },
  async addWatcherSource(source: Omit<WatchSourceConfig, 'id'>): Promise<WatchSourceConfig> {
    await mockApi.delay(50)
    const newSource: WatchSourceConfig = { ...source, id: `ws-${Date.now()}` }
    watcherSources.push(newSource)
    wsHandlers.get('watcherSources')?.([...watcherSources])
    return newSource
  },
  async removeWatcherSource(id: string): Promise<void> {
    await mockApi.delay(50)
    watcherSources = watcherSources.filter(x => x.id !== id)
    wsHandlers.get('watcherSources')?.([...watcherSources])
  },

  // Drives
  async getDrives(): Promise<DriveInfo[]> {
    await mockApi.delay(30)
    return [...drives]
  },

  // Scraper
  async scrapeGame(systemId: string, gameName: string): Promise<ScrapeResult> {
    await mockApi.delay(800)
    return {
      gameId: `${systemId}-${gameName.toLowerCase().replace(/\s+/g, '-')}`,
      title: gameName,
      boxArt: `https://example.com/boxart/${systemId}/${gameName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      screenshots: [`https://example.com/screen1.jpg`, `https://example.com/screen2.jpg`],
      description: `Descripción de ${gameName} para ${systemId}.`,
      releaseDate: '1998-11-21',
      developer: 'Nintendo',
      publisher: 'Nintendo',
      genre: ['Platformer', 'Adventure'],
      players: 1,
      rating: 'E'
    }
  },

  // Emulators
  async getEmulators(): Promise<EmulatorConfig[]> {
    await mockApi.delay(30)
    return [...emulators]
  },
  async launchGame(config: EmulatorLaunchConfig): Promise<void> {
    await mockApi.delay(100)
    console.log('Launching:', config)
  },

  // Config (GamerHub)
  async getConfig(): Promise<AppConfig> {
    await mockApi.delay(50)
    return { ...config }
  },
  async updateConfig(patch: Record<string, unknown>): Promise<AppConfig> {
    await mockApi.delay(100)
    // Simple merge for demo
    if (patch.global) config.global = { ...config.global, ...patch.global }
    if (patch.activeProfileId) config.activeProfileId = patch.activeProfileId as string
    wsHandlers.get('config')?.(config)
    return { ...config }
  },
  async getVersion(): Promise<string> {
    await mockApi.delay(30)
    return '2.1.2-ui'
  },
  async isElevated(): Promise<boolean> {
    await mockApi.delay(30)
    return false
  },

  // WebSocket simulation
  connectWS(_onOpen?: () => void, _onClose?: () => void): Promise<void> {
    return Promise.resolve()
  },
  disconnectWS() {},
  on<T>(event: string, handler: (data: T) => void) {
    wsHandlers.set(event, handler as (data: unknown) => void)
  },
  off(event: string) {
    wsHandlers.delete(event)
  },

  // Simulate real-time updates
  simulateProgress() {
    const active = downloads.filter(d => d.status === 'downloading')
    if (active.length === 0) return
    
    for (const d of active) {
      const chunk = Math.floor(Math.random() * 2_000_000) + 500_000
      d.downloaded = Math.min(d.size, d.downloaded + chunk)
      d.speed = chunk
      d.eta = d.speed > 0 ? Math.floor((d.size - d.downloaded) / d.speed) : 0
      if (d.downloaded >= d.size) {
        d.status = 'completed'
        d.downloaded = d.size
        d.speed = 0
        d.eta = 0
        d.completedAt = Date.now()
        d.finalPath = `/library/${d.consoleId}/${d.filename}`
      }
    }
    wsHandlers.get('downloads')?.([...downloads])
  }
}

// Start simulation
setInterval(() => mockApi.simulateProgress(), 1000)

// Export types for consumers
export type { DownloadItem, Settings, LibraryEntry, DatInfo, SendQueueStatus, DriveInfo, WatchSourceConfig, WatcherStatus, ScrapeResult, EmulatorConfig, EmulatorLaunchConfig, TransferJob, WatcherEvent, Route } from '@shared/types'
export type { AppConfig, Profile, GlobalSettings, DeviceProfile, SdSettings, WatcherSettings, DownloadSettings, ScraperSettings, QualityProfile } from '@shared/gamerhub'