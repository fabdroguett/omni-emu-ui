export type ConsoleId =
  | 'xbox'
  | 'xbox360'
  | 'nes'
  | 'snes'
  | 'n64'
  | 'gb'
  | 'gbc'
  | 'gba'
  | 'nds'
  | 'n3ds'
  | 'gc'
  | 'wii'
  | 'wiiu'
  | 'switch'
  | 'vb'
  | 'psx'
  | 'ps2'
  | 'ps3'
  | 'psp'
  | 'psvita'
  | 'sms'
  | 'megadrive'
  | 'sega32x'
  | 'segacd'
  | 'gamegear'
  | 'saturn'
  | 'dreamcast'
  | 'pcengine'
  | 'neogeo'
  | 'ngp'
  | 'wonderswan'
  | 'lynx'
  | 'atari2600'
  | 'atari7800'
  | 'arcade'
  | 'dos'
  | 'pc'
  | 'rpgmaker'
  | 'portable'
  | 'android'
  | 'unknown'

export interface ConsoleDef {
  id: ConsoleId
  name: string
  vendor: string
  /** Folder name used by ES-DE / Daijishō style libraries. */
  esdeFolder: string
  extensions: string[]
  keywords: string[]
  color: string
}

export const CONSOLES: ConsoleDef[] = [
  { id: 'nes', name: 'Nintendo Entertainment System', vendor: 'Nintendo', esdeFolder: 'nes', extensions: ['nes', 'fds', 'unf', 'unif', 'nsf'], keywords: ['nintendo entertainment system', 'famicom', 'nes'], color: '#e4453b' },
  { id: 'snes', name: 'Super Nintendo', vendor: 'Nintendo', esdeFolder: 'snes', extensions: ['sfc', 'smc', 'fig', 'swc', 'bs'], keywords: ['super nintendo', 'super famicom', 'snes', 'sfc'], color: '#8b5cf6' },
  { id: 'n64', name: 'Nintendo 64', vendor: 'Nintendo', esdeFolder: 'n64', extensions: ['n64', 'z64', 'v64', 'ndd'], keywords: ['nintendo 64', 'n64'], color: '#22c55e' },
  { id: 'gb', name: 'Game Boy', vendor: 'Nintendo', esdeFolder: 'gb', extensions: ['gb', 'sgb'], keywords: ['game boy', 'gameboy'], color: '#84cc16' },
  { id: 'gbc', name: 'Game Boy Color', vendor: 'Nintendo', esdeFolder: 'gbc', extensions: ['gbc'], keywords: ['game boy color', 'gameboy color', 'gbc'], color: '#a3e635' },
  { id: 'gba', name: 'Game Boy Advance', vendor: 'Nintendo', esdeFolder: 'gba', extensions: ['gba', 'srl', 'agb'], keywords: ['game boy advance', 'gameboy advance', 'gba'], color: '#6366f1' },
  { id: 'nds', name: 'Nintendo DS', vendor: 'Nintendo', esdeFolder: 'nds', extensions: ['nds', 'dsi', 'ids'], keywords: ['nintendo ds', 'nds', 'dsi'], color: '#94a3b8' },
  { id: 'n3ds', name: 'Nintendo 3DS', vendor: 'Nintendo', esdeFolder: 'n3ds', extensions: ['3ds', 'cia', 'cci', 'cxi', '3dsx', 'zcci', 'zcxi', 'z3dsx', 'zcia'], keywords: ['nintendo 3ds', '3ds'], color: '#ef4444' },
  { id: 'gc', name: 'GameCube', vendor: 'Nintendo', esdeFolder: 'gc', extensions: ['gcm', 'gcz', 'tgc'], keywords: ['gamecube', 'game cube', 'ngc', 'gcn'], color: '#7c3aed' },
  { id: 'wii', name: 'Wii', vendor: 'Nintendo', esdeFolder: 'wii', extensions: ['wbfs', 'wad', 'wia'], keywords: ['nintendo wii', 'wii'], color: '#38bdf8' },
  { id: 'wiiu', name: 'Wii U', vendor: 'Nintendo', esdeFolder: 'wiiu', extensions: ['wud', 'wux', 'wua', 'rpx'], keywords: ['wii u', 'wiiu'], color: '#0ea5e9' },
  { id: 'switch', name: 'Nintendo Switch', vendor: 'Nintendo', esdeFolder: 'switch', extensions: ['nsp', 'xci', 'nsz', 'xcz'], keywords: ['nintendo switch', 'switch'], color: '#f43f5e' },
  { id: 'vb', name: 'Virtual Boy', vendor: 'Nintendo', esdeFolder: 'virtualboy', extensions: ['vb', 'vboy'], keywords: ['virtual boy', 'virtualboy'], color: '#dc2626' },
  { id: 'psx', name: 'PlayStation', vendor: 'Sony', esdeFolder: 'psx', extensions: ['pbp', 'ecm', 'psx'], keywords: ['playstation 1', 'playstation', 'psone', 'psx', 'ps1'], color: '#facc15' },
  { id: 'ps2', name: 'PlayStation 2', vendor: 'Sony', esdeFolder: 'ps2', extensions: [], keywords: ['playstation 2', 'ps2'], color: '#3b82f6' },
  { id: 'ps3', name: 'PlayStation 3', vendor: 'Sony', esdeFolder: 'ps3', extensions: ['pkg'], keywords: ['playstation 3', 'ps3'], color: '#1d4ed8' },
  { id: 'psp', name: 'PSP', vendor: 'Sony', esdeFolder: 'psp', extensions: ['cso'], keywords: ['playstation portable', 'psp'], color: '#1e293b' },
  { id: 'psvita', name: 'PS Vita', vendor: 'Sony', esdeFolder: 'psvita', extensions: ['vpk', 'nonpdrm', 'mai'], keywords: ['playstation vita', 'ps vita', 'psvita', 'vita'], color: '#312e81' },
  { id: 'sms', name: 'Master System', vendor: 'Sega', esdeFolder: 'mastersystem', extensions: ['sms'], keywords: ['master system', 'mastersystem', 'sms'], color: '#f97316' },
  { id: 'megadrive', name: 'Mega Drive / Genesis', vendor: 'Sega', esdeFolder: 'megadrive', extensions: ['md', 'gen', 'smd'], keywords: ['mega drive', 'megadrive', 'genesis'], color: '#475569' },
  { id: 'sega32x', name: 'Sega 32X', vendor: 'Sega', esdeFolder: 'sega32x', extensions: ['32x'], keywords: ['32x'], color: '#4b5563' },
  { id: 'segacd', name: 'Sega CD', vendor: 'Sega', esdeFolder: 'segacd', extensions: [], keywords: ['sega cd', 'mega cd', 'mega-cd', 'segacd'], color: '#6b7280' },
  { id: 'gamegear', name: 'Game Gear', vendor: 'Sega', esdeFolder: 'gamegear', extensions: ['gg'], keywords: ['game gear', 'gamegear'], color: '#fb923c' },
  { id: 'saturn', name: 'Saturn', vendor: 'Sega', esdeFolder: 'saturn', extensions: [], keywords: ['sega saturn', 'saturn'], color: '#a855f7' },
  { id: 'dreamcast', name: 'Dreamcast', vendor: 'Sega', esdeFolder: 'dreamcast', extensions: ['gdi', 'cdi'], keywords: ['dreamcast'], color: '#f59e0b' },
  { id: 'pcengine', name: 'PC Engine / TurboGrafx', vendor: 'NEC', esdeFolder: 'pcengine', extensions: ['pce', 'sgx'], keywords: ['pc engine', 'pc-engine', 'turbografx', 'turbo grafx', 'pcengine'], color: '#e11d48' },
  { id: 'neogeo', name: 'Neo Geo', vendor: 'SNK', esdeFolder: 'neogeo', extensions: ['neo'], keywords: ['neo geo', 'neogeo', 'neo-geo'], color: '#fbbf24' },
  { id: 'ngp', name: 'Neo Geo Pocket', vendor: 'SNK', esdeFolder: 'ngpc', extensions: ['ngp', 'ngc', 'npc'], keywords: ['neo geo pocket', 'ngpc', 'ngp'], color: '#d97706' },
  { id: 'wonderswan', name: 'WonderSwan', vendor: 'Bandai', esdeFolder: 'wonderswan', extensions: ['ws', 'wsc'], keywords: ['wonderswan', 'wonder swan'], color: '#0d9488' },
  { id: 'lynx', name: 'Atari Lynx', vendor: 'Atari', esdeFolder: 'atarilynx', extensions: ['lnx', 'lyx'], keywords: ['atari lynx', 'lynx'], color: '#65a30d' },
  { id: 'atari2600', name: 'Atari 2600', vendor: 'Atari', esdeFolder: 'atari2600', extensions: ['a26'], keywords: ['atari 2600', 'atari2600', '2600'], color: '#b45309' },
  { id: 'atari7800', name: 'Atari 7800', vendor: 'Atari', esdeFolder: 'atari7800', extensions: ['a78'], keywords: ['atari 7800', 'atari7800', '7800'], color: '#92400e' },
  { id: 'xbox', name: 'Xbox', vendor: 'Microsoft', esdeFolder: 'xbox', extensions: ['xiso'], keywords: ['original xbox'], color: '#16a34a' },
  { id: 'xbox360', name: 'Xbox 360', vendor: 'Microsoft', esdeFolder: 'xbox360', extensions: ['xex'], keywords: ['xbox 360', 'xbox360'], color: '#65a30d' },
  { id: 'arcade', name: 'Arcade', vendor: 'Varios', esdeFolder: 'arcade', extensions: [], keywords: ['arcade', 'mame', 'fbneo', 'fba', 'final burn', 'cps1', 'cps2', 'cps3', 'naomi', 'atomiswave'], color: '#ec4899' },
  { id: 'dos', name: 'MS-DOS', vendor: 'PC', esdeFolder: 'dos', extensions: [], keywords: ['ms-dos', 'msdos', 'dos games', 'dosbox'], color: '#334155' },
  { id: 'pc', name: 'PC', vendor: 'PC', esdeFolder: 'pc', extensions: [], keywords: [' pc ', 'windows game', 'pc game'], color: '#0ea5e9' },
  { id: 'rpgmaker', name: 'RPG Maker', vendor: 'PC', esdeFolder: 'rpgmaker', extensions: ['rpgproj', 'ldb', 'lmt', 'rgss3.exe', 'rgss2.exe', 'rgss.exe'], keywords: ['rpg maker', 'rpgmaker', 'rgss'], color: '#a855f7' },
  { id: 'portable', name: 'Portable', vendor: 'PC', esdeFolder: 'portable', extensions: [], keywords: ['portable'], color: '#6366f1' },
  { id: 'android', name: 'Android', vendor: 'Android', esdeFolder: 'android', extensions: ['apk', 'obb', 'xapk', 'apks', 'apkm'], keywords: ['android', 'apk'], color: '#22c55e' },
  { id: 'unknown', name: 'Sin clasificar', vendor: '', esdeFolder: 'unsorted', extensions: [], keywords: [], color: '#64748b' }
]

export const CONSOLE_BY_ID: Record<ConsoleId, ConsoleDef> = Object.fromEntries(
  CONSOLES.map((c) => [c.id, c])
) as Record<ConsoleId, ConsoleDef>

/** Disc-image / container extensions that several systems share. */
export const AMBIGUOUS_EXTENSIONS = new Set([
  'iso', 'bin', 'cue', 'chd', 'img', 'mdf', 'nrg', 'ccd', 'rvz', 'cso', 'pbp', 'rom', 'm3u'
])
export const ARCHIVE_EXTENSIONS = new Set(['zip', '7z', 'rar', 'gz', 'tar', 'bz2', 'xz', 'zst'])

export const ROM_EXTENSIONS = new Set<string>([
  ...CONSOLES.flatMap((c) => c.extensions),
  ...AMBIGUOUS_EXTENSIONS
])

export function extensionOf(name: string): string {
  const base = name.split(/[?#]/)[0]
  const idx = base.lastIndexOf('.')
  if (idx < 0 || idx === base.length - 1) return ''
  return base.slice(idx + 1).toLowerCase()
}

export function isArchive(name: string): boolean {
  return ARCHIVE_EXTENSIONS.has(extensionOf(name))
}

export function isRomFile(name: string): boolean {
  return ROM_EXTENSIONS.has(extensionOf(name))
}

export function isDownloadableName(name: string): boolean {
  const ext = extensionOf(name)
  if (ROM_EXTENSIONS.has(ext) || ARCHIVE_EXTENSIONS.has(ext)) return true
  const vol = archiveVolume(name)
  return vol !== null && (vol.kind === 'archive' || isDownloadableName(vol.set))
}

/** Ambiguous extensions default to a system when no keyword resolves them. */
const AMBIGUOUS_DEFAULTS: Record<string, ConsoleId> = {
  cue: 'psx',
  bin: 'psx',
  chd: 'psx',
  pbp: 'psx',
  ecm: 'psx',
  m3u: 'psx',
  iso: 'ps2',
  cso: 'psp',
  rvz: 'gc',
  img: 'psx',
  mdf: 'psx',
  ccd: 'psx',
  nrg: 'psx'
}

function normalize(text: string): string {
  let t = text
  try {
    t = decodeURIComponent(text)
  } catch {
    /* keep raw */
  }
  return t
    .toLowerCase()
    .replace(/[_\-.\\/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Keyword matches are ordered by specificity so "game boy advance" wins over "game boy". */
const KEYWORD_INDEX: { keyword: string; id: ConsoleId }[] = CONSOLES.flatMap((c) =>
  c.keywords.map((keyword) => ({ keyword: normalize(keyword), id: c.id }))
).sort((a, b) => b.keyword.length - a.keyword.length)

function consoleFromKeywords(text: string): ConsoleId | null {
  const norm = ` ${normalize(text)} `
  for (const { keyword, id } of KEYWORD_INDEX) {
    if (keyword.length <= 4) {
      if (norm.includes(` ${keyword} `)) return id
    } else if (norm.includes(keyword)) {
      return id
    }
  }
  return null
}

/**
 * Detects the console from a filename and (optionally) the URL it came from.
 * An exclusive extension wins; otherwise keywords in the filename, then the
 * hint, then the URL path decide; ambiguous disc images fall back to a default.
 */
export function detectConsole(filename: string, url?: string, extraHint?: string): ConsoleId {
  const vol = archiveVolume(filename)
  if (vol) return detectConsole(vol.set, url, extraHint)
  const ext = extensionOf(filename)
  if (ext && !AMBIGUOUS_EXTENSIONS.has(ext) && !ARCHIVE_EXTENSIONS.has(ext)) {
    const owner = CONSOLES.find((c) => c.extensions.includes(ext))
    if (owner) return owner.id
  }
  const stem = filename.replace(/\.[^.]+$/, '')
  const urlDir = url ? url.replace(/^https?:\/\/[^/]+/, '').split(/[?#]/)[0].replace(/\/[^/]*$/, '') : ''
  const sources = [stem, extraHint ?? '', urlDir]
  for (const source of sources) {
    if (!source) continue
    const hit = consoleFromKeywords(source)
    if (hit) return hit
  }
  if (ext && AMBIGUOUS_DEFAULTS[ext]) return AMBIGUOUS_DEFAULTS[ext]
  return 'unknown'
}

/**
 * Console implied by exclusive ROM extensions (e.g. `.z64` → n64) among
 * extracted files; null when only ambiguous images (iso, bin…) are present.
 */
export function consoleFromExtensions(files: string[]): ConsoleId | null {
  const votes = new Map<ConsoleId, number>()
  for (const f of files) {
    const ext = extensionOf(f)
    if (!ext || AMBIGUOUS_EXTENSIONS.has(ext)) continue
    const owner = CONSOLES.find((c) => c.extensions.includes(ext))
    if (owner) votes.set(owner.id, (votes.get(owner.id) ?? 0) + 1)
  }
  let best: ConsoleId | null = null
  for (const [id, n] of votes) if (!best || n > votes.get(best)!) best = id
  return best
}

/** Advert shortcuts and OS clutter that archives often carry. */
export function isJunkFile(name: string): boolean {
  const base = name.split(/[\\/]/).pop()!.toLowerCase()
  return ['url', 'lnk', 'website', 'webloc'].includes(extensionOf(base)) || base === 'thumbs.db' || base === 'desktop.ini'
}

export interface VolumeInfo {
  /** Name of the whole thing: `Game.7z` for archive volumes, `Game.iso` for a plain split file. */
  set: string
  /** Position within the set (1-based for most tools; plain splits may start at 0). */
  index: number
  /** 'archive' = 7-Zip opens it from the first volume; 'raw' = pieces of one file, joined by concatenation. */
  kind: 'archive' | 'raw'
}

/**
 * Recognises one piece of a multi-part download; null for ordinary files.
 * Game.7z.001 / Game.7z.0001, Game.part1.rar, Game.z01 (+ Game.zip),
 * and plain splits such as Game.iso.001 made by HJSplit or FAT32 tools.
 */
export function archiveVolume(name: string): VolumeInfo | null {
  if (ROM_EXTENSIONS.has(extensionOf(name))) return null
  let m = /^(.*\.(?:7z|zip|rar))\.(\d{3,4})$/i.exec(name)
  if (m) return { set: m[1], index: Number(m[2]), kind: 'archive' }
  m = /^(.*)\.part(\d{1,4})\.rar$/i.exec(name)
  if (m) return { set: `${m[1]}.rar`, index: Number(m[2]), kind: 'archive' }
  m = /^(.*)\.z(\d{2})$/i.exec(name)
  if (m) return { set: `${m[1]}.zip`, index: Number(m[2]), kind: 'archive' }
  m = /^(.*\.([a-z0-9]{1,5}))\.(\d{3,4})$/i.exec(name)
  if (m && !ARCHIVE_EXTENSIONS.has(m[2].toLowerCase())) return { set: m[1], index: Number(m[3]), kind: 'raw' }
  return null
}

let folderIndex: Map<string, ConsoleId> | null = null

/** Console a library folder name stands for (`gba`, `Nintendo - Game Boy Advance`…); null for anything else. */
export function consoleFromFolderName(name: string): ConsoleId | null {
  if (!folderIndex) {
    folderIndex = new Map()
    for (const c of CONSOLES) {
      folderIndex.set(c.esdeFolder.toLowerCase(), c.id)
      folderIndex.set(c.name.toLowerCase(), c.id)
      if (c.vendor) folderIndex.set(`${c.vendor} - ${c.name}`.toLowerCase(), c.id)
    }
    folderIndex.set('sin clasificar', 'unknown')
  }
  return folderIndex.get(name.trim().toLowerCase()) ?? null
}

export function consoleFolder(id: ConsoleId, style: 'name' | 'esde'): string {
  const def = CONSOLE_BY_ID[id] ?? CONSOLE_BY_ID.unknown
  if (style === 'esde') return def.esdeFolder
  if (id === 'unknown') return 'Sin clasificar'
  return def.vendor ? `${def.vendor} - ${def.name}` : def.name
}