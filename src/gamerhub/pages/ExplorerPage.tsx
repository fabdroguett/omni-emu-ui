import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'
import { cn, formatBytes } from '@/lib/utils'
import { HardDrive, FolderOpen, ChevronRight, ChevronDown, Download, Copy, Trash2, RefreshCw, Search, Filter, Grid, List, Settings } from 'lucide-react'

const MOCK_DRIVES = [
  { id: 'C', label: 'Windows', fs: 'NTFS', size: 500_000_000_000, free: 150_000_000_000, removable: false, type: 'fixed' },
  { id: 'D', label: 'Games', fs: 'NTFS', size: 2_000_000_000_000, free: 800_000_000_000, removable: false, type: 'fixed' },
  { id: 'F', label: 'SDCARD', fs: 'exFAT', size: 128_000_000_000, free: 32_000_000_000, removable: true, type: 'sd' },
  { id: 'G', label: 'USB Drive', fs: 'exFAT', size: 64_000_000_000, free: 15_000_000_000, removable: true, type: 'removable' }
]

const MOCK_FILES = [
  { name: 'ROMs', type: 'folder', path: 'F:\\ROMs' },
  { name: 'BIOS', type: 'folder', path: 'F:\\BIOS' },
  { name: 'saves', type: 'folder', path: 'F:\\saves' },
  { name: 'n64', type: 'folder', path: 'F:\\ROMs\\n64' },
  { name: 'gba', type: 'folder', path: 'F:\\ROMs\\gba' },
  { name: 'nds', type: 'folder', path: 'F:\\ROMs\\nds' },
  { name: 'zelda_oot.z64', type: 'file', size: 32_000_000, path: 'F:\\ROMs\\n64\\zelda_oot.z64' },
  { name: 'mario64.z64', type: 'file', size: 8_000_000, path: 'F:\\ROMs\\n64\\mario64.z64' }
]

function FileIcon({ name, type }: { name: string; type: 'file' | 'folder' }) {
  if (type === 'folder') return <FolderOpen size={16} className="text-accent" />
  const ext = name.split('.').pop()?.toLowerCase()
  if (['z64', 'n64', 'v64'].includes(ext || '')) return <span className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center text-green-400 text-[8px]">N64</span>
  if (['gba'].includes(ext || '')) return <span className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-[8px]">GBA</span>
  if (['nds'].includes(ext || '')) return <span className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 text-[8px]">NDS</span>
  if (['zip', '7z', 'rar'].includes(ext || '')) return <span className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 text-[8px]">ARC</span>
  return <span className="w-5 h-5 rounded bg-surface-elevated flex items-center justify-center text-text-muted text-[8px]">FILE</span>
}

export function ExplorerPage() {
  const { drives, selectedDrive, setSelectedDrive } = useAppStore()
  const [currentPath, setCurrentPath] = useState('F:\\ROMs')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const drive = drives.find(d => d.stableId === selectedDrive) || drives.find(d => d.letter === 'F')
  const files = MOCK_FILES.filter(f => f.path.startsWith(currentPath) && f.path !== currentPath)
    .filter(f => {
      const relative = f.path.slice(currentPath.length + 1)
      return !relative.includes('\\') || relative.split('\\').length === 1
    })

  const goUp = () => {
    const parts = currentPath.split('\\')
    if (parts.length > 1) {
      setCurrentPath(parts.slice(0, -1).join('\\') || parts[0] + '\\')
    }
  }

  const navigate = (path: string) => {
    if (path.endsWith('\\') || MOCK_FILES.some(f => f.path === path && f.type === 'folder')) {
      setCurrentPath(path.endsWith('\\') ? path : path + '\\')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Explorador</h1>
          <p className="text-text-muted mt-1">Navega y gestiona archivos en tus dispositivos</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDrive || ''}
            onChange={e => setSelectedDrive(e.target.value || null)}
            className="px-3 py-2 bg-surface border border-line rounded-lg text-text focus-ring text-sm min-w-[180px]"
          >
            {drives.map(d => (
              <option key={d.stableId} value={d.stableId}>
                {d.label} ({d.letter}:)
              </option>
            ))}
          </select>
          <Button variant="secondary" size="sm" onClick={goUp} disabled={currentPath.split('\\').length <= 1}><ChevronRight size={16} className="rotate-180" /> Subir</Button>
          <Button variant="secondary" size="sm" onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
          </Button>
        </div>
      </div>

      {drive && (
        <Card variant="elevated" className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <HardDrive size={24} className="text-accent" />
                <div>
                  <p className="font-medium text-text">{drive.label} ({drive.letter}:)</p>
                  <p className="text-sm text-text-muted">{drive.fs} · {drive.type === 'sd' ? 'Tarjeta SD' : drive.removable ? 'Extraíble' : 'Fijo'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">Libre</span>
                  <Progress value={((drive.size - drive.free) / drive.size) * 100} className="w-48" showLabel />
                </div>
                <span className="font-mono text-text tabular-nums">{formatBytes(drive.free)} / {formatBytes(drive.size)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card variant="elevated" className="flex-1 min-h-[500px] flex flex-col">
        <div className="border-b border-line px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1 bg-surface rounded-lg px-2">
            {currentPath.split('\\').filter(Boolean).map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPath(currentPath.split('\\').slice(0, i + 1).join('\\') + '\\')}
                  className="px-2 py-1 text-sm text-text hover:bg-surface-elevated rounded"
                >
                  {part}
                </button>
                {i < currentPath.split('\\').filter(Boolean).length - 1 && <ChevronRight size={12} className="text-text-muted" />}
              </span>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>{files.length} elementos</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className={cn(
                    'relative p-3 rounded-lg border border-line bg-surface transition-all',
                    'hover:border-accent/50 hover:bg-surface-elevated',
                    selectedFiles.includes(file.path) && 'border-accent bg-accent/5 ring-1 ring-accent/20'
                  )}
                  onClick={e => {
                    if (e.ctrlKey || e.metaKey) {
                      setSelectedFiles(prev => prev.includes(file.path) ? prev.filter(p => p !== file.path) : [...prev, file.path])
                    } else {
                      setSelectedFiles([file.path])
                    }
                    if (file.type === 'folder') navigate(file.path)
                  }}
                  onDoubleClick={e => { e.stopPropagation(); if (file.type === 'folder') navigate(file.path) }}
                >
                  <FileIcon name={file.name} type={file.type} />
                  <p className="mt-2 text-sm font-medium text-text truncate">{file.name}</p>
                  {file.type === 'file' && <p className="text-xs text-text-muted tabular-nums">{formatBytes(file.size)}</p>}
                  {selectedFiles.includes(file.path) && <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center"><Copy size={10} className="text-white" /></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line bg-surface/50">
                    <th className="px-4 py-2 text-sm font-medium text-text-muted w-8"></th>
                    <th className="px-4 py-2 text-sm font-medium text-text-muted">Nombre</th>
                    <th className="px-4 py-2 text-sm font-medium text-text-muted">Tipo</th>
                    <th className="px-4 py-2 text-sm font-medium text-text-muted w-32">Tamaño</th>
                    <th className="px-4 py-2 text-sm font-medium text-text-muted w-32"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {files.map((file, i) => (
                    <tr key={i} className={cn('hover:bg-surface-elevated/50', selectedFiles.includes(file.path) && 'bg-accent/5')}>
                      <td className="px-4 py-2">
                        <input type="checkbox" checked={selectedFiles.includes(file.path)} onChange={e => { e.stopPropagation(); setSelectedFiles(prev => e.target.checked ? [...prev, file.path] : prev.filter(p => p !== file.path)) }} className="w-4 h-4 accent-accent" />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <FileIcon name={file.name} type={file.type} />
                          <span className="font-medium text-text truncate max-w-[300px]">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-text-muted">{file.type === 'folder' ? 'Carpeta' : 'Archivo'}</td>
                      <td className="px-4 py-2 text-sm text-text-muted tabular-nums">{file.type === 'file' ? formatBytes(file.size) : '-'}</td>
                      <td className="px-4 py-2">
                        <Button variant="ghost" size="sm" className="text-error"><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="border-t border-line p-3 bg-accent/5 flex items-center justify-between">
            <span className="text-sm font-medium text-accent">{selectedFiles.length} seleccionado{selectedFiles.length !== 1 ? 's' : ''}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"><Copy size={14} /> Copiar</Button>
              <Button variant="secondary" size="sm"><Download size={14} /> Descargar</Button>
              <Button variant="danger" size="sm"><Trash2 size={14} /> Eliminar</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}