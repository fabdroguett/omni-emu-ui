import type { Hashes } from './types'

export function matchDecomps(hashes: Hashes | null): string[] {
  if (!hashes) return []
  const results: string[] = []
  if (hashes.sha1) results.push('sha1')
  if (hashes.md5) results.push('md5')
  if (hashes.crc32) results.push('crc32')
  return results
}