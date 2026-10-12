import { create } from 'zustand'
import type { AppConfig, Profile, DeviceProfile, GlobalSettings, Route } from '@shared/gamerhub'
import { getActiveProfile } from '@shared/gamerhub/config'
import { mockApi } from '@/api'

interface AppState {
  ready: boolean
  config: AppConfig | null
  route: Route
  drives: DeviceProfile[]
  selectedDrive: string | null
  isElevated: boolean
  version: string

  setRoute: (route: Route) => void
  setSelectedDrive: (letter: string | null) => void
  subscribe: () => void
  initialise: () => Promise<void>
  refreshDrives: () => Promise<void>
  patchConfig: (patch: Record<string, unknown>) => Promise<void>
  patchProfile: (patch: Record<string, unknown>) => Promise<void>
  profile: () => Profile | null
  resolvedMode: () => 'light' | 'dark'
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
}

let initialisePromise: Promise<void> | null = null
let drivesRefresh: Promise<void> | null = null
let appEventsSubscribed = false

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  config: null,
  route: '/descargas',
  drives: [],
  selectedDrive: null,
  isElevated: false,
  version: '',

  setRoute: (route) => set({ route }),
  setSelectedDrive: (letter) => set({ selectedDrive: letter }),

  subscribe: () => {
    if (appEventsSubscribed) return
    appEventsSubscribed = true
    if (mockApi) {
      mockApi.on('config', (config: AppConfig) => set({ config }))
      mockApi.on('drives', (drives: DeviceProfile[]) => {
        set({ drives })
        const current = get().selectedDrive
        if (current && !drives.some((drive) => drive.stableId === current)) {
          set({ selectedDrive: null })
        }
      })
      mockApi.on('navigate', (route: Route) => set({ route }))
    }
  },

  initialise: async () => {
    if (get().ready) return
    if (!initialisePromise) {
      initialisePromise = (async () => {
        if (mockApi) {
          const config = await mockApi.getConfig()
          set({ config, ready: true })
          void mockApi.getVersion().then((version) => set({ version })).catch(() => undefined)
          void mockApi.isElevated().then((isElevated) => set({ isElevated })).catch(() => undefined)
          void get().refreshDrives().catch((error) => console.error('No se pudieron enumerar las unidades', error))
        }
      })()
    }
    try {
      await initialisePromise
    } catch (error) {
      initialisePromise = null
      throw error
    }
  },

  refreshDrives: async () => {
    if (drivesRefresh) return drivesRefresh
    drivesRefresh = (async () => {
      if (mockApi) {
        const drives = await mockApi.getDrives()
        // Convert DriveInfo to DeviceProfile for UI
        const deviceProfiles: DeviceProfile[] = drives.map(d => ({
          stableId: d.uniqueId,
          name: d.label,
          type: d.removable ? 'sd' : 'disk',
          lastLetter: d.letter,
          currentLetter: d.letter,
          volumeGuid: d.uniqueId,
          pnpDeviceId: null,
          serial: null,
          busType: 'USB',
          filesystem: d.fileSystem,
          totalBytes: d.size,
          label: d.label,
          model: null,
          isActive: false,
          folderScheme: 'esde',
          romsFolderName: 'ROMs',
          biosFolderName: 'BIOS',
          nominalWriteMbs: null,
          nominalReadMbs: null,
          lowSpaceThreshold: 0.1,
          lastSeen: new Date().toISOString(),
          connected: true,
          frontendTarget: 'daijisho',
          customRoot: '',
          verifiedCopies: []
        }))
        set({ drives: deviceProfiles })

        if (!get().selectedDrive) {
          const profile = get().profile()
          const configured = profile?.sd.deviceProfiles.find(p => p.isActive)?.stableId
          const preferred = 
            (configured && deviceProfiles.find((drive) => drive.stableId === configured)) ??
            deviceProfiles.find((drive) => drive.type === 'sd' && !drive.currentLetter?.includes('C')) ??
            deviceProfiles.find((drive) => drive.type === 'sd')
          if (preferred) set({ selectedDrive: preferred.stableId })
        }
      }
    })().finally(() => { drivesRefresh = null })
    return drivesRefresh
  },

  patchConfig: async (patch) => {
    if (mockApi) {
      const config = await mockApi.updateConfig(patch)
      set({ config })
    }
  },

  patchProfile: async (patch) => {
    const config = get().config
    if (!config) return
    if (mockApi) {
      const updated = await mockApi.updateConfig({
        profiles: { [config.activeProfileId]: patch }
      })
      set({ config: updated })
    }
  },

  profile: () => {
    const config = get().config
    return config ? getActiveProfile(config) : null
  },

  resolvedMode: () => {
    const theme = get().config?.global.theme ?? 'dark'
    if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light'
    return theme
  }
}))

export function useProfile(): Profile | null {
  return useAppStore((state) => (state.config ? getActiveProfile(state.config) : null))
}