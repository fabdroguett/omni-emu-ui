import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatBytes } from '@/lib/utils'
import { FolderGit2, FolderOpen, Plus, Minus, ArrowUpDown, Trash2, Edit, Copy, Download, Settings, ChevronRight } from 'lucide-react'

interface TreeItem {
  name: string
  type: 'folder' | 'file'
  size?: number
  children?: TreeItem[]
  path?: string
}

const MOCK_STRUCTURE: TreeItem[] = [
  { name: 'ROMs', type: 'folder', path: 'F:\\ROMs', children: [
    { name: 'n64', type: 'folder', path: 'F:\\ROMs\\n64', children: [
      { name: 'The Legend of Zelda - Ocarina of Time (USA).z64', type: 'file', size: 32_000_000, path: 'F:\\ROMs\\n64\\zelda_oot.z64' },
      { name: 'Super Mario 64 (USA).z64', type: 'file', size: 8_000_000, path: 'F:\\ROMs\\n64\\mario64.z64' },
      { name: 'Mario Kart 64 (USA).z64', type: 'file', size: 24_000_000, path: 'F:\\ROMs\\n64\\mariokart64.z64' }
    ]},
    { name: 'gba', type: 'folder', path: 'F:\\ROMs\\gba', children: [
      { name: 'Pokemon Emerald (USA).gba', type: 'file', size: 16_000_000, path: 'F:\\ROMs\\gba\\pokemon_emerald.gba' },
      { name: 'Advance Wars (USA).gba', type: 'file', size: 8_000_000, path: 'F:\\ROMs\\gba\\advance_wars.gba' }
    ]},
    { name: 'nds', type: 'folder', path: 'F:\\ROMs\\nds', children: [
      { name: 'Pokemon HeartGold (USA).nds', type: 'file', size: 128_000_000, path: 'F:\\ROMs\\nds\\pokemon_heartgold.nds' }
    ]}
  ]}
]

function TreeNode({ item, level = 0, onSelect, expanded, onToggle }: { item: TreeItem; level: number; onSelect: (item: TreeItem) => void; expanded: Set<string>; onToggle: (path: string) => void }) {
  const isFolder = item.type === 'folder'
  const isExpanded = expanded.has(item.path || item.name)
  const hasChildren = isFolder && item.children && item.children.length > 0

  return (
    <li>
      <div className="flex items-center gap-1">
        {isFolder && hasChildren && (
          <button
            onClick={e => { e.stopPropagation(); onToggle(item.path || item.name) }}
            className="p-1 rounded hover:bg-surface-elevated text-text-muted"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Colapsar ${item.name}` : `Expandir ${item.name}`}
          >
            {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
          </button>
        )}
        {!isFolder && <span className="w-5" />}
        <span
          className={cn(
            'flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-elevated cursor-pointer',
            isFolder ? 'font-medium text-text' : 'text-sm'
          )}
          onClick={() => onSelect(item)}
        >
          {isFolder ? <FolderGit2 size={16} className="text-accent" /> : (
            <span className="w-5 h-5 rounded flex items-center justify-center bg-surface-elevated">
              <Copy size={10} className="text-text-muted" />
            </span>
          )}
          <span className={cn('truncate', isFolder ? 'max-w-[200px]' : 'max-w-[180px]')}>{item.name}</span>
          {isFolder && hasChildren && <span className="text-xs text-text-muted">({item.children?.length || 0})</span>}
          {!isFolder && item.size && <span className="text-xs text-text-muted tabular-nums ml-auto">{formatBytes(item.size)}</span>}
        </span>
      </div>
      {isFolder && hasChildren && isExpanded && (
        <ul className="ml-6 mt-1 space-y-1 border-l border-line/30 pl-3">
          {item.children?.map((child, ci) => (
            <TreeNode
              key={`${child.path || child.name}-${ci}`}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function FolderTree({ items, onSelect }: { items: TreeItem[]; onSelect: (item: TreeItem) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['F:\\ROMs', 'F:\\ROMs\\n64']))

  const onToggle = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <TreeNode
          key={`${item.path || item.name}-${i}`}
          item={item}
          onSelect={onSelect}
          expanded={expanded}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}

export function StructurePage() {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Estructura</h1>
          <p className="text-text-muted mt-1">Visualiza y organiza la estructura de carpetas de tu biblioteca</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><FolderOpen size={16} /> Expandir todo</Button>
          <Button variant="secondary" size="sm"><ArrowUpDown size={16} /> Reorganizar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="lg:col-span-3 h-[600px] overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle>Árbol de directorios</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4">
              <FolderTree items={MOCK_STRUCTURE} onSelect={setSelectedItem} />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Detalles</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {selectedItem.type === 'folder' ? <FolderGit2 size={24} className="text-accent" /> : <Copy size={24} className="text-text-muted" />}
                  <div>
                    <p className="font-medium text-text">{selectedItem.name}</p>
                    <p className="text-sm text-text-muted">{selectedItem.type === 'folder' ? 'Carpeta' : 'Archivo'}</p>
                  </div>
                </div>
                {selectedItem.type === 'file' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Tamaño</span><span className="font-mono text-text">{formatBytes(selectedItem.size!)}</span></div>
                  </div>
                )}
                {selectedItem.type === 'folder' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Elementos</span><span className="font-mono text-text">{selectedItem.children?.length || 0}</span></div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="flex-1"><Edit size={14} /> Renombrar</Button>
                  <Button variant="secondary" size="sm" className="flex-1"><Download size={14} /> Exportar</Button>
                  {selectedItem.type === 'folder' && (
                    <Button variant="danger" size="sm" className="flex-1"><Trash2 size={14} /> Eliminar</Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <FolderGit2 size={48} className="mx-auto mb-4 opacity-30" />
                <p>Selecciona un elemento para ver detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}