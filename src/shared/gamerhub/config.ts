import { z } from 'zod'
import { DEFAULT_EXTENSION_MAP, DEFAULT_IGNORED_EXTENSIONS } from './systems'
import { DENSITY_IDS, EXPERIENCE_IDS, inferExperience } from './experience'

export const WatchSourceSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  path: z.string().min(1),
  enabled: z.boolean().default(true),
  recursive: z.boolean().default(true),
  deleteAfterTransfer: z.boolean().default(false),
  deleteWhenAlreadyOnCard: z.boolean().default(false),
  autoExtractArchives: z.boolean().default(true)
})

export const DeviceProfileSchema = z.object({
  stableId: z.string(),
  name: z.string().min(1),
  type: z.enum(['sd', 'mtp', 'disk', 'network']).default('sd'),
  lastLetter: z.string().nullable().default(null),
  currentLetter: z.string().nullable().default(null),
  volumeGuid: z.string().nullable().default(null),
  pnpDeviceId: z.string().nullable().default(null),
  serial: z.string().nullable().default(null),
  busType: z.enum(['USB', 'SD', 'SATA', 'NVMe', 'Unknown']).default('Unknown'),
  filesystem: z.string().default('unknown'),
  totalBytes: z.number().nonnegative().default(0),
  label: z.string().default(''),
  model: z.string().nullable().default(null),
  isActive: z.boolean().default(false),
  folderScheme: z.enum(['daijisho', 'esde']).default('daijisho'),
  romsFolderName: z.string().default('ROMs'),
  biosFolderName: z.string().default('BIOS'),
  nominalWriteMbs: z.number().positive().nullable().default(null),
  nominalReadMbs: z.number().positive().nullable().default(null),
  lowSpaceThreshold: z.number().min(0).max(1).default(0.1),
  lastSeen: z.string().nullable().default(null),
  connected: z.boolean().default(false),
  frontendTarget: z.enum(['daijisho', 'esde', 'retroarch', 'custom']).default('daijisho'),
  customRoot: z.string().default(''),
  verifiedCopies: z.array(z.string()).default([])
})

export type DeviceProfile = z.infer<typeof DeviceProfileSchema>

export const SdSettingsSchema = z.object({
  driveLetter: z.string().nullable().default(null),
  autoDetect: z.boolean().default(true),
  romsFolderName: z.string().default('ROMs'),
  biosFolderName: z.string().default('BIOS'),
  folderScheme: z.enum(['daijisho', 'esde']).default('daijisho'),
  nominalWriteMbs: z.number().positive().nullable().default(null),
  nominalReadMbs: z.number().positive().nullable().default(null),
  lowSpaceThreshold: z.number().min(0).max(1).default(0.1),
  deviceProfiles: z.array(DeviceProfileSchema).default([])
})

export const WatcherSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  sources: z.array(WatchSourceSchema).default([]),
  dryRun: z.boolean().default(true),
  hashAlgorithm: z.enum(['md5', 'sha1', 'sha256']).default('md5'),
  concurrency: z.number().int().min(1).max(8).default(1),
  batchSize: z.number().int().min(0).max(1000).default(25),
  rescanIntervalMs: z.number().int().min(0).max(24 * 60 * 60 * 1000).default(15 * 60 * 1000),
  stabilityIntervalMs: z.number().int().min(200).max(30_000).default(1500),
  stabilityChecks: z.number().int().min(1).max(20).default(3),
  bufferSizeBytes: z.number().int().min(64 * 1024).max(64 * 1024 * 1024).default(8 * 1024 * 1024),
  extensionMap: z.record(z.string(), z.string()).default(DEFAULT_EXTENSION_MAP),
  ignoredExtensions: z.array(z.string()).default(DEFAULT_IGNORED_EXTENSIONS),
  skipKnownHashes: z.boolean().default(true),
  warnOnHashChange: z.boolean().default(true),
  retryAttempts: z.number().int().min(0).max(10).default(3),
  retryDelayMs: z.number().int().min(500).max(120_000).default(5000),
  minFileBytes: z.number().int().min(0).default(1024),
  routeUnknownToUnsorted: z.boolean().default(true),
  verifyContent: z.boolean().default(true),
  onNotARom: z.enum(['skip', 'unsorted', 'transfer']).default('skip'),
  onWrongSystem: z.enum(['reroute', 'unsorted', 'transfer']).default('reroute'),
  onPcDisc: z.enum(['copy', 'extract']).default('copy'),
  verifyOnline: z.boolean().default(true),
  renameToCatalogName: z.boolean().default(true),
  verifyDestination: z.boolean().default(true),
  onlineMaxFileBytes: z.number().int().min(0).default(8 * 1024 * 1024 * 1024),
  deleteArchiveAfterExtract: z.boolean().default(false),
  deleteExtractedFolderAfterTransfer: z.boolean().default(false)
})

export const DownloadSettingsSchema = z.object({
  destinationDir: z.string().default(''),
  maxConcurrentDownloads: z.number().int().min(1).max(10).default(3),
  connectionsPerDownload: z.number().int().min(1).max(16).default(4),
  globalSpeedLimit: z.number().int().min(0).default(0),
  clipboardMonitor: z.boolean().default(false),
  autoExtract: z.boolean().default(true),
  deleteArchiveAfterExtract: z.boolean().default(false),
  savedPasswords: z.array(z.string()).default([]),
  organiseByType: z.boolean().default(true),
  userAgent: z.string().default('Mozilla/5.0 (Windows NT 10.0; Win64; x64) OmniEmu/1.0 Safari/537.36'),
  retryAttempts: z.number().int().min(0).max(10).default(3)
})

export const ScraperSettingsSchema = z.object({
  provider: z.enum(['screenscraper', 'thegamesdb', 'igdb']).default('screenscraper'),
  screenscraper: z.object({
    username: z.string().default(''),
    password: z.string().default(''),
    devId: z.string().default(''),
    devPassword: z.string().default('')
  }).default({ username: '', password: '', devId: '', devPassword: '' }),
  thegamesdb: z.object({ apiKey: z.string().default('') }).default({ apiKey: '' }),
  igdb: z.object({ clientId: z.string().default(''), clientSecret: z.string().default('') }).default({ clientId: '', clientSecret: '' }),
  preferredRegions: z.array(z.string()).default(['us', 'eu', 'wor', 'jp']),
  preferredLanguage: z.string().default('es'),
  downloadBoxArt: z.boolean().default(true),
  downloadScreenshots: z.boolean().default(true),
  downloadVideos: z.boolean().default(false),
  autoScrapeOnScan: z.boolean().default(false),
  systemIdOverrides: z.record(z.string(), z.number()).default({}),
  requestsPerMinute: z.number().int().min(1).max(600).default(60)
})

export const QualityProfileSchema = z.object({
  id: z.enum(['default', 'performance', 'quality']),
  name: z.string().min(1),
  fullscreen: z.boolean().default(true),
  internalResolution: z.number().min(0.5).max(8).default(1),
  aspectRatio: z.enum(['auto', '4:3', '16:9', '16:10', 'custom']).default('auto'),
  customAspectRatio: z.string().optional(),
  bilinearFilter: z.boolean().default(true),
  shader: z.string().optional(),
  textureFiltering: z.enum(['auto', 'nearest', 'linear', 'anisotropic']).default('auto'),
  anisotropicLevel: z.number().int().min(1).max(16).default(4),
  vsync: z.boolean().default(true),
  frameLimit: z.number().int().min(0).max(240).default(0),
  audioLatency: z.number().int().min(16).max(512).default(64),
  extraArgs: z.array(z.string()).default([]),
  dualScreenLayout: z.enum(['side-by-side', 'top-bottom', 'single']).default('side-by-side'),
  singleScreen: z.enum(['top', 'bottom']).default('top'),
  cpuClock: z.number().min(0.5).max(3).default(1),
  gpuClock: z.number().min(0.5).max(3).default(1),
  widescreenHack: z.boolean().default(false),
  gameOverrides: z.record(z.string(), z.object({
    internalResolution: z.number().min(0.5).max(8).optional(),
    aspectRatio: z.enum(['auto', '4:3', '16:9', '16:10', 'custom']).optional(),
    customAspectRatio: z.string().optional(),
    shader: z.string().optional(),
    extraArgs: z.array(z.string()).optional(),
    dualScreenLayout: z.enum(['side-by-side', 'top-bottom', 'single']).optional(),
    singleScreen: z.enum(['top', 'bottom']).optional(),
    cpuClock: z.number().min(0.5).max(3).optional(),
    gpuClock: z.number().min(0.5).max(3).optional(),
    widescreenHack: z.boolean().optional()
  })).default({})
})

export const EmulatorConfigSchema = z.object({
  systemId: z.string(),
  executablePath: z.string(),
  arguments: z.string().default('"{rom}"'),
  enabled: z.boolean().default(true),
  qualityProfiles: z.array(QualityProfileSchema).default([
    { id: 'default', name: 'Predeterminado', fullscreen: true, internalResolution: 1, aspectRatio: 'auto', bilinearFilter: true, textureFiltering: 'auto', anisotropicLevel: 4, vsync: true, frameLimit: 0, audioLatency: 64, extraArgs: [], dualScreenLayout: 'side-by-side', singleScreen: 'top', cpuClock: 1, gpuClock: 1, widescreenHack: false, gameOverrides: {} },
    { id: 'performance', name: 'Rendimiento', fullscreen: true, internalResolution: 1, aspectRatio: 'auto', bilinearFilter: false, textureFiltering: 'nearest', anisotropicLevel: 1, vsync: false, frameLimit: 0, audioLatency: 128, extraArgs: [], dualScreenLayout: 'side-by-side', singleScreen: 'top', cpuClock: 1, gpuClock: 1, widescreenHack: false, gameOverrides: {} },
    { id: 'quality', name: 'Calidad', fullscreen: true, internalResolution: 3, aspectRatio: 'auto', bilinearFilter: true, textureFiltering: 'anisotropic', anisotropicLevel: 16, vsync: true, frameLimit: 0, audioLatency: 32, extraArgs: [], dualScreenLayout: 'side-by-side', singleScreen: 'top', cpuClock: 1, gpuClock: 1, widescreenHack: false, gameOverrides: {} }
  ]),
  activeQualityProfile: z.enum(['default', 'performance', 'quality']).default('default')
})

const branchDefault =
  <T extends z.ZodType>(schema: T): (() => z.infer<T>) =>
  () =>
    schema.parse({}) as z.infer<T>

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  sd: SdSettingsSchema.default(branchDefault(SdSettingsSchema)),
  watcher: WatcherSettingsSchema.default(branchDefault(WatcherSettingsSchema)),
  downloads: DownloadSettingsSchema.default(branchDefault(DownloadSettingsSchema)),
  scraper: ScraperSettingsSchema.default(branchDefault(ScraperSettingsSchema)),
  emulators: z.array(EmulatorConfigSchema).default([])
})

export const GlobalSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('dark'),
  accentColor: z.string().default('#7c5cff'),
  language: z.enum(['es']).default('es'),
  experience: z.enum(EXPERIENCE_IDS).default('gamer'),
  density: z.enum(DENSITY_IDS).default('comfortable'),
  environment: z.enum(['pc', 'handheld']).nullable().default(null),
  onboardingCompleted: z.boolean().default(false),
  minimizeToTray: z.boolean().default(true),
  closeToTray: z.boolean().default(true),
  startMinimised: z.boolean().default(false),
  nativeNotifications: z.boolean().default(true),
  notifyAboveBytes: z.number().int().min(0).default(512 * 1024 * 1024),
  autoUpdate: z.boolean().default(false),
  sidebarCollapsed: z.boolean().default(false),
  dataDir: z.string().default('')
})

export const AppConfigSchema = z.object({
  version: z.number().int().default(1),
  activeProfileId: z.string().default('default'),
  profiles: z.record(z.string(), ProfileSchema),
  global: GlobalSettingsSchema.default(branchDefault(GlobalSettingsSchema))
})

export type WatchSourceConfig = z.infer<typeof WatchSourceSchema>
export type SdSettings = z.infer<typeof SdSettingsSchema>
export type WatcherSettings = z.infer<typeof WatcherSettingsSchema>
export type DownloadSettings = z.infer<typeof DownloadSettingsSchema>
export type ScraperSettings = z.infer<typeof ScraperSettingsSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type GlobalSettings = z.infer<typeof GlobalSettingsSchema>
export type EmulatorConfig = z.infer<typeof EmulatorConfigSchema>
export type QualityProfile = z.infer<typeof QualityProfileSchema>
export type AppConfig = z.infer<typeof AppConfigSchema>

export const DEFAULT_PROFILE_ID = 'default'

export function createDefaultConfig(): AppConfig {
  return AppConfigSchema.parse({
    version: 1,
    activeProfileId: DEFAULT_PROFILE_ID,
    profiles: {
      [DEFAULT_PROFILE_ID]: {
        id: DEFAULT_PROFILE_ID,
        name: 'Principal'
      }
    },
    global: {}
  })
}

export function parseConfigSafely(input: unknown): { config: AppConfig; repaired: boolean } {
  const result = AppConfigSchema.safeParse(input)
  if (result.success) {
    const config = result.data
    migrateExperience(config, input)
    return { config, repaired: false }
  }

  const fallback = createDefaultConfig()
  if (!input || typeof input !== 'object') return { config: fallback, repaired: true }

  const raw = input as {
    profiles?: unknown
    global?: unknown
    activeProfileId?: unknown
  }

  const profiles: Record<string, Profile> = {}
  if (raw.profiles && typeof raw.profiles === 'object') {
    for (const [id, candidate] of Object.entries(raw.profiles as Record<string, unknown>)) {
      if (!candidate || typeof candidate !== 'object') continue
      const parsed = ProfileSchema.safeParse({ name: id, ...candidate, id })
      if (parsed.success) profiles[id] = parsed.data
    }
  }
  if (Object.keys(profiles).length === 0) return { config: fallback, repaired: true }

  const global = GlobalSettingsSchema.safeParse(raw.global)
  const activeProfileId =
    typeof raw.activeProfileId === 'string' && profiles[raw.activeProfileId]
      ? raw.activeProfileId
      : (Object.keys(profiles)[0] as string)

  const config: AppConfig = {
    version: fallback.version,
    activeProfileId,
    profiles,
    global: global.success ? global.data : fallback.global
  }
  migrateExperience(config, input)
  return { config, repaired: true }
}

function migrateExperience(config: AppConfig, input: unknown): void {
  const rawGlobal =
    input && typeof input === 'object' ? (input as { global?: unknown }).global : undefined
  if (rawGlobal && typeof rawGlobal === 'object' && 'experience' in rawGlobal) return
  config.global.experience = inferExperience(config.global)
}

export function getActiveProfile(config: AppConfig): Profile {
  const profile = config.profiles[config.activeProfileId]
  if (profile) return profile
  const first = Object.values(config.profiles)[0]
  if (first) return first
  return createDefaultConfig().profiles[DEFAULT_PROFILE_ID]
}