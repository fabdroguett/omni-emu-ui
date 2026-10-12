import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn, formatBytes } from '@/lib/utils'
import { Search, Filter, HardDrive, Database, RefreshCw, FolderOpen, Trash2, Download, Plus, Settings } from 'lucide-react'

const MOCK_LIBRARY = [
  { console: 'n64', name: 'The Legend of Zelda: Ocarina of Time', size: 32_000_000, region: 'USA', verified: true },
  { console: 'n64', name: 'Super Mario 64', size: 8_000_000, region: 'USA', verified: true },
  { console: 'n64', name: 'Mario Kart 64', size: 24_000_000, region: 'USA', verified: true },
  { console: 'gba', name: 'Pokémon Emerald', size: 16_000_000, region: 'USA', verified: true },
  { console: 'gba', name: 'Advance Wars', size: 8_000_000, region: 'USA', verified: true },
  { console: 'nds', name: 'Pokémon HeartGold', size: 128_000_000, region: 'USA', verified: true },
  { console: 'nds', name: 'Mario Kart DS', size: 64_000_000, region: 'USA', verified: true },
  { console: 'n3ds', name: 'Monster Hunter 4 Ultimate', size: 1_800_000_000, region: 'USA', verified: true },
  { console: 'snes', name: 'Chrono Trigger', size: 4_000_000, region: 'USA', verified: true },
  { console: 'psx', name: 'Final Fantasy VII', size: 1_200_000_000, region: 'USA', verified: true }
]

export function LibraryPage() {
  const { setRoute } = useAppStore()
  const [search, setSearch] = useState('')
  const [consoleFilter, setConsoleFilter] = useState('')

  const filtered = MOCK_LIBRARY.filter(g => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false
    if (consoleFilter && g.console !== consoleFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Biblioteca</h1>
          <p className="text-text-muted mt-1">{filtered.length} juegos en tu colección</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setRoute('/diagnostico')}><Database size={16} /> Verificar DATs</Button>
          <Button variant="primary" size="sm"><Plus size={16} /> Importar</Button>
        </div>
      </div>

      <Card variant="elevated">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted size-4" />
              <input
                type="search"
                placeholder="Buscar juegos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface border border-line rounded-lg text-text placeholder:text-text-muted focus-ring text-sm"
              />
            </div>
            <select
              value={consoleFilter}
              onChange={e => setConsoleFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-line rounded-lg text-text focus-ring text-sm min-w-[180px]"
            >
              <option value="">Todas las consolas</option>
              <option value="n64">Nintendo 64</option>
              <option value="gba">Game Boy Advance</option>
              <option value="nds">Nintendo DS</option>
              <option value="n3ds">Nintendo 3DS</option>
              <option value="snes">Super Nintendo</option>
              <option value="psx">PlayStation</option>
            </select>
            <Button variant="ghost" size="sm"><RefreshCw size={16} /> Actualizar</Button>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-surface/50">
                  <th className="px-4 py-3 text-sm font-medium text-text-muted">Juego</th>
                  <th className="px-4 py-3 text-sm font-medium text-text-muted">Consola</th>
                  <th className="px-4 py-3 text-sm font-medium text-text-muted">Región</th>
                  <th className="px-4 py-3 text-sm font-medium text-text-muted">Tamaño</th>
                  <th className="px-4 py-3 text-sm font-medium text-text-muted">Estado</th>
                  <th className="px-4 py-3 text-sm font-medium text-text-muted"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((game, i) => (
                  <tr key={i} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text">{game.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="accent" size="sm">{game.console.toUpperCase()}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">{game.region}</td>
                    <td className="px-4 py-3 text-sm text-text-muted tabular-nums">{formatBytes(game.size)}</td>
                    <td className="px-4 py-3">
                      {game.verified ? (
                        <Badge variant="success" size="sm" dot>Verificado</Badge>
                      ) : (
                        <Badge variant="warning" size="sm" dot>Sin verificar</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm"><Download size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}