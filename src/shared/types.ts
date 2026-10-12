import type { ConsoleId } from './consoles'
import type { DeviceProfile } from './gamerhub/config'

export type ConsoleId = ConsoleId

export type DownloadStatus =
  | 'queued'
  | 'connecting'
  | 'downloading'
  | 'processing'
  | 'paused'
  | 'completed'
  | 'error'

export interface Segment {
  index: number
  start: number
  /** Inclusive end offset. -1 when the total size is unknown. */
  end: number
  downloaded: number
}

export interface RomName {
  title: string
  regions: string[]
  languages: string[]
  tags: string[]
  revision: string | null
  isBeta: boolean
  isProto: boolean
  isDemo: boolean
  isHack: boolean
}

export interface Hashes {
  crc32: string
  md5: string
  sha1: string
  /** N64 dumps in v64/n64 byte order: SHA-1 of the same data in native .z64 order, which ports check. */
  sha1z64?: string
  md5z64?: string
  /** XXH3-64 / XXH3-128 (of the .z64-order data for N64 dumps), used by N64Recomp projects and Dusklight. */
  xxh3?: string
  xxh3_128?: string
  /** SNES dumps with a 512-byte copier header: SHA-1 without it (what zelda3 / smw check). */
  sha1Headerless?: string
}

export interface DownloadItem {
  id: string
  url: string
  finalUrl: string | null
  filename: string
  dir: string
  /** -1 while unknown. */
  size: number
  downloaded: number
  status: DownloadStatus
  segments: Segment[]
  resumable: boolean
  connections: number
  speed: number
  eta: number
  error: string | null
  createdAt: number
  completedAt: number | null
  headers: Record<string, string>
  consoleId: ConsoleId
  consoleLocked: boolean
  rom: RomName
  finalPath: string | null
  extractedFiles: string[]
  hashes: Hashes | null
  processingStep: string | null
  /** ETag / Last-Modified captured at probe time; a change on resume forces a restart. */
  etag: string | null
  verification: Verification | null
  note: string | null
  /** 'web' = downloaded by IDM; 'telegram' = picked up from a watched folder. */
  source: ItemSource
  /** Imports only: files claimed from the watched folder (staged next to it until processed). */
  localFiles: string[]
  /** Imports only: where those files were before being claimed, to put them back. */
  originalPaths: string[]
  send: SendState | null
  /** Folder imports: copy (default) leaves the source untouched; move takes it out of the source folder. */
  importMode?: 'copy' | 'move'
  /** Folder imports: also copy to the SD / phone once filed. */
  sendAfterImport?: boolean
  /** Web downloads: copy to the GameHub destination (SD/phone) once finished. */
  sendToGameHub?: boolean
  /** What the ROM's own header says (console, internal title, product code). */
  identity?: RomIdentity | null
  /**
   * The header names a game but its hash matches no loaded DAT for that console:
   * probably a hack, translation or modified dump. Only set when DATs for the
   * console exist (without them there is nothing to compare against).
   */
  hackSuspect?: boolean | null
  /** 3DS only: what «preparar para Azahar» found and did. */
  azahar?: AzaharState | null
  /** File host the link belongs to (MediaFire, Mega…): its page is resolved to a fresh direct link on every start. */
  host?: string | null
  /** Mega only: the file arrives encrypted and is decrypted (AES-128-CTR) when it finishes. Hex strings. */
  mega?: { key: string; iv: string } | null
}

/**
 * Outcome of preparing a 3DS game for Azahar:
 * - ready: already playable as it was (decrypted, flags right)
 * - fixed: decrypted data whose header still said «encrypted»; the flag was patched
 * - decrypted: really encrypted, decrypted with the user's boot9.bin / aes_keys.txt
 * - converted: a CIA turned into a playable .3ds (decrypting it first if needed)
 * - install: CIA with an update or DLC, to install from Azahar (not a game you launch)
 * - encrypted: encrypted and no keys available, Azahar cannot open it yet
 * - error: the file could not be read or written
 */
export type AzaharStatus = 'ready' | 'fixed' | 'decrypted' | 'converted' | 'install' | 'encrypted' | 'error'

export interface AzaharState {
  status: AzaharStatus
  /** One line for the list, e.g. «Descifrada · comprimida a .zcci». */
  summary: string
  /** What was done, in order (for the details dialog). */
  steps: string[]
  /** Container the file was in before processing. */
  sourceFormat: 'ncsd' | 'ncch' | 'cia' | '3dsx' | 'z3ds' | 'unknown'
  /** Final file, e.g. `D:\Roms\n3ds\Game.zcci`. */
  output: string | null
  titleId: string | null
  productCode: string | null
  /** Short title from the SMDH icon, when readable. */
  title: string | null
  compressed: boolean
  sizeBefore: number
  sizeAfter: number
  at: number
}

export interface AzaharKeysInfo {
  /** Decryption keys available (boot9.bin or a complete aes_keys.txt). */
  found: boolean
  kind: 'boot9' | 'aes_keys' | null
  source: string | null
  /** seeddb.bin, needed only by a few eShop titles that use seed crypto. */
  seeddb: string | null
  /** Z3DS compression is possible (zstd available in this runtime). */
  canCompress: boolean
}

export type ItemSource = 'web' | 'telegram' | 'folder'

export type SendStatus = 'waiting' | 'queued' | 'copying' | 'done' | 'error'

export interface SendState {
  status: SendStatus
  /** Destination of the main file once known. */
  target: string | null
  copied: number
  total: number
  speed: number
  error: string | null
  at: number | null
}

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
  /** Master switch «Traslado al teléfono / SD»: when off nothing is copied and nothing is queued automatically. */
  enabled: boolean
  kind: SendToKind
  /** MTP destination state (kind 'mtp' only; refreshed in the background, may be a few seconds old). */
  mtp: MtpDestinationInfo | null
  root: string
  /** The configured card, when connected (possibly under another letter). */
  drive: DriveInfo | null
  /** Root actually used right now (drive letter remapped if needed). */
  resolvedRoot: string | null
  pending: number
  activeId: string | null
  speed: number
}

/** What the ROM itself says (internal header / signature), independent of its file name and extension. */
export interface RomIdentity {
  consoleId: ConsoleId
  /** Which signature was recognised, e.g. "logo de Nintendo (GBA)". */
  how: string
  title: string | null
  serial: string | null
  region: string | null
}

export interface Verification {
  datId: string
  datName: string
  game: string
  rom: string
  /** Which hash produced the match. */
  by: 'sha1' | 'md5' | 'crc32'
}

export interface DatInfo {
  id: string
  name: string
  version: string
  consoleId: ConsoleId
  entries: number
  importedAt: number
}

export type FolderStyle = 'name' | 'esde'

/** What to do when the destination already holds a file with that name. */
export type ExistingFileAction = 'ask' | 'replace' | 'both' | 'skip'

export interface ConflictRequest {
  id: string
  /** The name that collides and the folder it would go into. */
  name: string
  dir: string
  existingSize: number
  existingAt: number
  newSize: number
}

export interface ConflictAnswer {
  choice: Exclude<ExistingFileAction, 'ask'>
  /** Do the same for the rest of this batch without asking again. */
  applyToAll: boolean
}
export type QueueDoneAction = 'none' | 'sleep' | 'shutdown'

export interface Settings {
  libraryRoot: string
  /** Where non-ROM captures (documents, installers…) go. */
  otherDownloadsDir: string
  organizeByConsole: boolean
  folderStyle: FolderStyle
  extractArchives: boolean
  deleteArchiveAfterExtract: boolean
  computeHashes: boolean
  skipExisting: boolean
  /** Destination already has a file with that name: ask, replace it, keep both or skip. */
  onExistingFile: ExistingFileAction
  renameToDat: boolean
  /**
   * Rename a finished download to the name its catalogue entry carries, when the online ROM
   * databases verify it against a catalogued dump. Only a verified hash match renames; a
   * name-only answer, a hack or a disc set whose descriptor names its own tracks never do.
   */
  renameToCatalogName: boolean
  onQueueDone: QueueDoneAction
  maxConnections: number
  maxConcurrent: number
  /** Bytes per second. 0 = unlimited. */
  speedLimit: number
  retries: number
  userAgent: string
  clipboardMonitor: boolean
  notifications: boolean
  minimizeToTray: boolean
  bridgeEnabled: boolean
  bridgePort: number
  /**
   * Shared secret the browser extension must present on every request. Empty
   * means unpaired: the loopback port still works, but any local process can
   * reach it. Setting it restricts the bridge to the extension.
   */
  bridgeToken: string
  /** Pick up finished files from watched folders (Telegram Desktop) and file them into the library. */
  watchEnabled: boolean
  watchFolders: string[]
  /** A file must keep the same size this long before it is considered finished. */
  watchSettleSeconds: number
  /** ROMs that arrive through Telegram also go to the SD / phone automatically (even if sendToAuto is off). */
  sendTelegramAuto: boolean
  /** 'drive': a folder with a drive letter (SD in a card reader). 'mtp': a phone connected over USB. */
  sendToKind: SendToKind
  /** Master switch for copying to the SD / phone. Off: nothing is sent (queued copies wait until it is on again). */
  sendToEnabled: boolean
  /** Copy destination, e.g. the SD card (`F:\ROMs`); console subfolders go below it. */
  sendToRoot: string
  /** MTP: device name as Windows shows it (e.g. "motorola edge 60 fusion"). */
  sendToMtpDevice: string
  /** MTP: storage and folder on the device, e.g. `Tarjeta SD\Roms`. */
  sendToMtpPath: string
  /** Volume the destination belongs to, so a card mounted under another letter is still found. */
  sendToVolumeId: string | null
  sendToFolderStyle: FolderStyle
  sendToAuto: boolean
  /**
   * Default for new web downloads: copy to the GameHub destination (SD/phone)
   * once finished ("descargar y después GameHub"). Per-download opt-in in the
   * add dialog overrides nothing — the item flag is what the engine reads.
   */
  downloadThenGameHub: boolean
  /** Send only ROM files (cue/bin sets included), leaving manuals, covers and docs on the PC. */
  sendOnlyRoms: boolean
  verifyCopies: boolean
  /** Watch the library and put new / misplaced files in order by itself. */
  autoOrganize: boolean
  /** The organiser may also remove identical duplicates, junk and leftover temp folders (to the Recycle Bin). */
  autoOrganizeCleanup: boolean
  /** When the destination connects, copy again anything already sent that is missing there. */
  sendToAutoRepair: boolean
  /** Folders reviewed with «Revisar carpetas», most recent first. */
  auditFolders: string[]
  /** «Limpieza de nombres»: accents and symbols out of file names when downloading and extracting. */
  cleanNames: boolean
  /** 3DS games are left playable in Azahar after downloading / extracting (before sending to the phone). */
  azaharPrepare: boolean
  /** Also compress them to Azahar's Z3DS format (.zcci / .zcxi): same game, much smaller. */
  azaharCompress: boolean
  /** Cut the unused padding at the end of cartridge dumps. */
  azaharTrim: boolean
  /** boot9.bin or aes_keys.txt for encrypted games; empty = look in the usual places. */
  azaharKeysPath: string
  /** Passwords tried on protected archives before asking (like JDownloader's password list). */
  archivePasswords: string[]
  /** Small always-on-top window with what is downloading right now. */
  floatingWindow: boolean
  /** The floating window hides by itself while nothing is in progress and comes back when something starts. */
  floatingOnlyActive: boolean
  /** Keep the floating window above full-screen games and other windows. */
  floatingSticky: boolean
  /** Show recently completed downloads in the floating window. */
  floatingShowRecent: boolean
  /** Show archive extraction progress in the floating window. */
  floatingShowExtractProgress: boolean
  /** Where the floating window was last left. */
  floatingBounds: { x: number; y: number; width: number; height: number } | null
  /** If the app cannot capture a download (offline, capture failed), let the browser save it normally and import it later. */
  fallbackToBrowser: boolean
  /** Accent color as CSS hex string (e.g. '#7c5cff'). */
  accentColor: string
  /** RGB mode: 'static' | 'rainbow' | 'breathing' | 'reactive' */
  accentRgbMode: 'static' | 'rainbow' | 'breathing' | 'reactive'
  /** RGB speed multiplier (0.5 - 3). */
  accentRgbSpeed: number
  /** Device profiles for SD cards, phones, and external disks. */
  deviceProfiles: DeviceProfile[]
}

export interface AddRequest {
  url: string
  filename?: string
  dir?: string
  connections?: number
  headers?: Record<string, string>
  consoleId?: ConsoleId
  autoStart?: boolean
  /** Per-download opt-in: copy to the GameHub destination (SD/phone) when finished. */
  sendToGameHub?: boolean
}

export interface PageLink {
  url: string
  filename: string
  text: string
  consoleId: ConsoleId
  rom: RomName
  size: string | null
}

export interface PageScan {
  url: string
  title: string
  links: PageLink[]
  suggestedConsole: ConsoleId
}

export interface Stats {
  totalSpeed: number
  active: number
  queued: number
  completed: number
}

export interface BridgeStatus {
  running: boolean
  port: number
  extensionDir: string
  chromeDir: string
  firefoxDir: string
  firefoxXpi: string
}

export type AuditKind = 'rom' | 'archive' | 'set' | 'junk'

export interface AuditArchiveEntry {
  path: string
  size: number
  crc32: string | null
  consoleId: ConsoleId
  verification: Verification | null
  inLibrary: string | null
}

export interface AuditEntry {
  id: string
  /** Main file (the ROM, the archive, or the first part of a multi-part set). */
  path: string
  /** All files that belong to this entry (parts of a set; otherwise just `path`). */
  parts: string[]
  root: string
  size: number
  kind: AuditKind
  consoleId: ConsoleId
  detectedBy: 'extensión' | 'cabecera' | 'nombre' | 'contenido' | null
  title: string
  hashes: Hashes | null
  verification: Verification | null
  decomps: { portName: string; romLabel: string }[]
  /** Identical file already in the library. */
  inLibrary: string | null
  /** Identical to another file found in this review. */
  duplicateOf: string | null
  /** Already on the SD / phone (same console folder, name and size); null when not checked. */
  onDestination: boolean | null
  /** What the ROM's own header says (for archives: the main ROM inside). */
  identity: RomIdentity | null
  contents: AuditArchiveEntry[]
  issues: string[]
}

export interface AuditReport {
  folders: string[]
  startedAt: number
  finishedAt: number
  cancelled: boolean
  entries: AuditEntry[]
  /** Files that are not ROMs, archives or junk (covers, saves, videos…). */
  otherFiles: number
  otherBytes: number
  datsLoaded: number
}

export interface AuditProgress {
  phase: 'library' | 'scan' | 'analyze'
  done: number
  total: number
  current: string | null
}

/** aside: not a ROM (manual, cover, document…), moved to the «not ROMs» folder by «Solo ordenar». */
export type ReorgKind = 'move' | 'extract' | 'aside' | 'junk' | 'duplicate' | 'leftover'

export interface ReorgAction {
  id: string
  kind: ReorgKind
  from: string
  /** move: destination · duplicate: the identical copy that stays · extract: console folder guess · junk: null */
  to: string | null
  consoleId: ConsoleId
  reason: string
  size: number
}

export interface ReorgPlan {
  root: string
  createdAt: number
  actions: ReorgAction[]
  /** Files that are neither ROMs, archives nor junk (manuals, covers…): never touched. */
  untouched: number
  /** «Solo ordenar»: folder that receives what is not a ROM. */
  asideDir?: string
  /**
   * Intelligent-engine review (additive, optional for backward compat).
   * `vetoedIds` = action ids the brain flags unsafe (needs review / waiting
   * for components / low confidence). GUI should uncheck these by default
   * but still let the user override. `notes` maps game/group id → explanation.
   */
  brain?: {
    vetoedIds: string[]
    vetoReasons: Record<string, string>
    notes: { gameId: string; title: string; text: string }[]
    /** The auxiliary review could not run; the UI should require manual selection. */
    skippedReason?: string
  }
}

export interface ReorgResult {
  applied: number
  appliedIds: string[]
  failed: { id: string; from: string; error: string }[]
  /**
   * What really landed, in order. Recorded on success only, which is what makes
   * "applied" mean "done" and lets undo be generated from the record instead of
   * guessed. `to` is null for a deletion, which cannot be undone from a journal.
   */
  journal?: {
    seq: number
    actionId: string
    kind: ReorgKind
    from: string
    to: string | null
    bytes: number
    modifiedAt: number
    at: number
  }[]
}

/** One change the automatic organiser made (kept for the history list). */
export interface OrganizeHistoryEntry {
  at: number
  kind: ReorgKind
  from: string
  to: string | null
  reason: string
}

export interface OrganizeStatus {
  enabled: boolean
  watching: string | null
  running: boolean
  lastRunAt: number | null
  /** Changes waiting for their files to stop changing. */
  waiting: number
}

export interface LibraryEntry {
  consoleId: ConsoleId
  folder: string
  files: number
  bytes: number
}

export type GrabStatus = 'online' | 'offline' | 'unknown'

/** One file found by the link grabber (a direct link, a file-host page or a file inside a shared folder). */
export interface GrabbedLink {
  id: string
  /** What gets added: the direct link, or the file host's page (resolved again when the download starts). */
  url: string
  filename: string
  /** -1 when unknown. */
  size: number
  status: GrabStatus
  /** Host label shown in the list («MediaFire», «Mega», «Directo»…). */
  host: string
  /** Package the file belongs to: the folder / page it came from, or its game / archive set. */
  package: string
  consoleId: ConsoleId
  error: string | null
  /** Page the link was found on (sent as Referer). */
  referer: string | null
}

export interface GrabResult {
  links: GrabbedLink[]
  /** Links that could not be read at all. */
  errors: { url: string; error: string }[]
}

export interface GrabProgress {
  done: number
  total: number
  current: string | null
}

/** One «Solo ordenar» run that can be undone: where each file was moved from and to. */
export interface SortRun {
  id: string
  at: number
  root: string
  moves: { from: string; to: string }[]
  /** Archives extracted / files sent to the Recycle Bin in that run (not undone automatically). */
  other: number
}

// Additional types for API
export interface WatchSourceConfig {
  id: string
  label: string
  path: string
  enabled: boolean
  recursive: boolean
  deleteAfterTransfer: boolean
  deleteWhenAlreadyOnCard: boolean
  autoExtractArchives: boolean
}

export interface WatcherStatus {
  running: boolean
  sources: number
  queueLength: number
  currentFile: string | null
  speed: number
  lastScan: number
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

export interface EmulatorConfig {
  systemId: string
  executablePath: string
  arguments: string
  enabled: boolean
  qualityProfiles: any[]
  activeQualityProfile: string
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
  status: string
  progress: number
  speed: number
  error?: string
  startTime: number
  endTime?: number
}

export interface WatcherEvent {
  type: string
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