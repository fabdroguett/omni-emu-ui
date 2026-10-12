export const EXPERIENCE_IDS = ['gamer', 'collector', 'developer', 'custom'] as const
export type ExperienceId = typeof EXPERIENCE_IDS[number]

export const DENSITY_IDS = ['compact', 'comfortable', 'spacious'] as const
export type DensityId = typeof DENSITY_IDS[number]

export interface ExperienceProfile {
  id: ExperienceId
  name: string
  description: string
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  density: DensityId
  sidebarCollapsed: boolean
  showAdvancedSettings: boolean
  defaultRoute: string
}

export const EXPERIENCE_PROFILES: Record<ExperienceId, ExperienceProfile> = {
  gamer: {
    id: 'gamer',
    name: 'Jugador',
    description: 'Enfoque en jugar: biblioteca grande, lanzamiento rápido, overlays mínimos.',
    theme: 'dark',
    accentColor: '#7c5cff',
    density: 'comfortable',
    sidebarCollapsed: false,
    showAdvancedSettings: false,
    defaultRoute: '/biblioteca'
  },
  collector: {
    id: 'collector',
    name: 'Coleccionista',
    description: 'Enfoque en organización: DATs, escaneo, auditoría, renombrado, metadatos.',
    theme: 'dark',
    accentColor: '#f59e0b',
    density: 'compact',
    sidebarCollapsed: false,
    showAdvancedSettings: true,
    defaultRoute: '/diagnostico'
  },
  developer: {
    id: 'developer',
    name: 'Desarrollador',
    description: 'Enfoque en depuración: logs, consola, red, rendimiento, emuladores.',
    theme: 'dark',
    accentColor: '#22d3ee',
    density: 'compact',
    sidebarCollapsed: true,
    showAdvancedSettings: true,
    defaultRoute: '/monitor'
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    description: 'Tu configuración a medida.',
    theme: 'system',
    accentColor: '#7c5cff',
    density: 'comfortable',
    sidebarCollapsed: false,
    showAdvancedSettings: false,
    defaultRoute: '/'
  }
}

export function inferExperience(global: { theme?: string; accentColor?: string; density?: string; sidebarCollapsed?: boolean }): ExperienceId {
  const { theme = 'dark', accentColor = '#7c5cff', density = 'comfortable', sidebarCollapsed = false } = global

  if (theme === 'dark' && accentColor === '#7c5cff' && density === 'comfortable' && sidebarCollapsed === false) return 'gamer'
  if (theme === 'dark' && accentColor === '#f59e0b' && density === 'compact' && sidebarCollapsed === false) return 'collector'
  if (theme === 'dark' && accentColor === '#22d3ee' && density === 'compact' && sidebarCollapsed === true) return 'developer'

  return 'custom'
}

export function applyExperience(config: { global: { theme: string; accentColor: string; density: string; sidebarCollapsed: boolean } }, experienceId: ExperienceId): void {
  const profile = EXPERIENCE_PROFILES[experienceId]
  config.global.theme = profile.theme
  config.global.accentColor = profile.accentColor
  config.global.density = profile.density
  config.global.sidebarCollapsed = profile.sidebarCollapsed
}