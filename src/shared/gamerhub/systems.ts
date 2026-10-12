export const SYSTEM_IDS = [
  'nes', 'snes', 'n64', 'gb', 'gbc', 'gba', 'nds', 'n3ds',
  'gc', 'wii', 'wiiu', 'switch',
  'psx', 'ps2', 'ps3', 'psp', 'psvita',
  'sms', 'megadrive', 'sega32x', 'segacd', 'gamegear', 'saturn', 'dreamcast',
  'pcengine', 'neogeo', 'ngp', 'wonderswan', 'lynx',
  'atari2600', 'atari7800',
  'xbox', 'xbox360',
  'arcade', 'dos', 'pc', 'rpgmaker', 'portable', 'android',
  'vb'
] as const

export type SystemId = typeof SYSTEM_IDS[number]

export const DEFAULT_EXTENSION_MAP: Record<string, string> = {
  // Nintendo
  'nes': 'nes', 'fds': 'nes', 'unf': 'nes', 'unif': 'nes', 'nsf': 'nes',
  'sfc': 'snes', 'smc': 'snes', 'fig': 'snes', 'swc': 'snes', 'bs': 'snes',
  'n64': 'n64', 'z64': 'n64', 'v64': 'n64', 'ndd': 'n64',
  'gb': 'gb', 'sgb': 'gb',
  'gbc': 'gbc',
  'gba': 'gba', 'srl': 'gba', 'agb': 'gba',
  'nds': 'nds', 'dsi': 'nds', 'ids': 'nds',
  '3ds': 'n3ds', 'cia': 'n3ds', 'cci': 'n3ds', 'cxi': 'n3ds', '3dsx': 'n3ds', 'zcci': 'n3ds', 'zcxi': 'n3ds', 'z3dsx': 'n3ds', 'zcia': 'n3ds',
  'gcm': 'gc', 'gcz': 'gc', 'tgc': 'gc',
  'wbfs': 'wii', 'wad': 'wii', 'wia': 'wii',
  'wud': 'wiiu', 'wux': 'wiiu', 'wua': 'wiiu', 'rpx': 'wiiu',
  'nsp': 'switch', 'xci': 'switch', 'nsz': 'switch', 'xcz': 'switch',
  'vb': 'vb', 'vboy': 'vb',
  // Sony
  'pbp': 'psx', 'ecm': 'psx', 'psx': 'psx',
  'pkg': 'ps3',
  'cso': 'psp',
  'vpk': 'psvita', 'nonpdrm': 'psvita', 'mai': 'psvita',
  // Sega
  'sms': 'sms',
  'md': 'megadrive', 'gen': 'megadrive', 'smd': 'megadrive',
  '32x': 'sega32x',
  'gg': 'gamegear',
  'gdi': 'dreamcast', 'cdi': 'dreamcast',
  // NEC
  'pce': 'pcengine', 'sgx': 'pcengine',
  // SNK
  'neo': 'neogeo',
  'ngp': 'ngp', 'ngc': 'ngp', 'npc': 'ngp',
  // Bandai
  'ws': 'wonderswan', 'wsc': 'wonderswan',
  // Atari
  'lnx': 'lynx', 'lyx': 'lynx',
  'a26': 'atari2600',
  'a78': 'atari7800',
  // Microsoft
  'xiso': 'xbox',
  'xex': 'xbox360',
  // PC / Other
  'apk': 'android', 'obb': 'android', 'xapk': 'android', 'apks': 'android', 'apkm': 'android',
  'rpgproj': 'rpgmaker', 'ldb': 'rpgmaker', 'lmt': 'rpgmaker', 'rgss3.exe': 'rpgmaker', 'rgss2.exe': 'rpgmaker', 'rgss.exe': 'rpgmaker',
  // Disc images (ambiguous)
  'iso': 'ps2', 'bin': 'psx', 'cue': 'psx', 'chd': 'psx', 'img': 'psx', 'mdf': 'psx', 'nrg': 'psx', 'ccd': 'psx', 'rvz': 'gc', 'm3u': 'psx',
  // Archives
  'zip': 'archive', '7z': 'archive', 'rar': 'archive', 'gz': 'archive', 'tar': 'archive', 'bz2': 'archive', 'xz': 'archive', 'zst': 'archive'
}

export const DEFAULT_IGNORED_EXTENSIONS = [
  'txt', 'log', 'ini', 'cfg', 'conf', 'xml', 'json', 'yml', 'yaml',
  'md', 'rtf', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'ico',
  'mp3', 'wav', 'ogg', 'flac', 'mp4', 'mkv', 'avi', 'mov', 'wmv',
  'exe', 'dll', 'so', 'dylib', 'msi', 'bat', 'cmd', 'ps1', 'sh',
  'url', 'lnk', 'webloc', 'desktop',
  'nfo', 'sfv', 'md5', 'sha1', 'sha256',
  'cue', 'm3u', 'm3u8', 'pls',
  'db', 'sqlite', 'sqlite3',
  'tmp', 'temp', 'bak', 'backup',
  'DS_Store', 'Thumbs.db', 'ehthumbs.db'
]

export function extensionMapToArray(map: Record<string, string>): { ext: string; system: string }[] {
  return Object.entries(map).map(([ext, system]) => ({ ext, system }))
}

export function arrayToExtensionMap(arr: { ext: string; system: string }[]): Record<string, string> {
  return Object.fromEntries(arr.map(({ ext, system }) => [ext, system]))
}