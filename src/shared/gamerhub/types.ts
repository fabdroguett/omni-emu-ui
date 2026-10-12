export interface DriveInfo {
  letter: string
  label: string
  fileSystem: string
  uniqueId: string
  free: number
  size: number
  removable: boolean
}

export type SendToKind = 'drive' | 'mtp'

export interface MtpDestinationInfo {
  device: string
  storage: string
  connected: boolean
  free: number
}

export interface SendQueueStatus {
  enabled: boolean
  kind: SendToKind
  mtp: MtpDestinationInfo | null
  root: string
  drive: DriveInfo | null
  resolvedRoot: string | null
  pending: number
  activeId: string | null
  speed: number
}

export interface GameFile {
  path: string
  name: string
  size: number
  consoleId: string
  hash?: string
  isArchive: boolean
  archivePath?: string
}

export interface LibraryStats {
  totalGames: number
  totalSize: number
  byConsole: Record<string, { count: number; size: number }>
  missingDats: string[]
}

export interface ScrapeResult {
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

export interface EmulatorLaunchConfig {
  emulatorPath: string
  arguments: string
  systemId: string
  romPath: string
  qualityProfile: string
}

export interface TransferJob {
  id: string
  source: string
  destination: string
  status: 'waiting' | 'queued' | 'copying' | 'verifying' | 'done' | 'error'
  progress: number
  speed: number
  error?: string
  startTime: number
  endTime?: number
}

export interface WatcherEvent {
  type: 'file_detected' | 'file_stable' | 'transfer_started' | 'transfer_progress' | 'transfer_done' | 'transfer_error' | 'archive_extracted' | 'hash_computed' | 'scraped'
  payload: unknown
  timestamp: number
}

export type Route =
  | '/descargas'
  | '/'
  | '/diagnostico'
  | '/estructura'
  | '/watcher'
  | '/monitor'
  | '/explorador'
  | '/biblioteca'
  | '/bigbox'
  | '/ajustes'