// API entry point - switches between real backend and mock based on environment
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let apiModule: { api: any; mockApi?: any }

if (USE_MOCK) {
  apiModule = await import('./mock')
} else {
  apiModule = await import('./client')
}

export const api = apiModule.api
export const mockApi = USE_MOCK ? apiModule.mockApi : null

export type { 
  DownloadItem, 
  Settings, 
  LibraryEntry, 
  DatInfo, 
  SendQueueStatus, 
  DriveInfo, 
  WatchSourceConfig, 
  WatcherStatus, 
  ScrapeResult, 
  EmulatorConfig, 
  EmulatorLaunchConfig,
  TransferJob,
  WatcherEvent,
  Route 
} from '@shared/types'
export type { 
  AppConfig, 
  Profile, 
  GlobalSettings, 
  DeviceProfile, 
  SdSettings, 
  WatcherSettings, 
  DownloadSettings, 
  ScraperSettings, 
  QualityProfile 
} from '@shared/gamerhub'