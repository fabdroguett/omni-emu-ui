import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { cn } from '@/lib/utils'
import { Download, X, Plus, Minus, FileText, Link2 } from 'lucide-react'

interface AddDialogProps {
  initialUrls?: string[]
}

export function AddDialog({ initialUrls = [] }: AddDialogProps) {
  const { closeDialog, openDialog } = useStore()
  const [urls, setUrls] = useState(initialUrls.length > 0 ? initialUrls : [''])
  const [dir, setDir] = useState('/downloads')
  const [connections, setConnections] = useState(4)
  const [consoleId, setConsoleId] = useState('')
  const [sendToGameHub, setSendToGameHub] = useState(false)
  const [isFolder, setIsFolder] = useState(false)
  const [folderPath, setFolderPath] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validUrls = urls.filter(u => u.trim())
    if (validUrls.length === 0) return
    // In mock mode, just close
    closeDialog()
    // Could add to mock API here
  }

  const addUrlField = () => setUrls([...urls, ''])
  const removeUrlField = (i: number) => setUrls(urls.filter((_, idx) => idx !== i))

  return (
    <Dialog open={true} onOpenChange={closeDialog} title="Añadir descarga" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-muted">Enlaces (uno por línea)</label>
          <div className="space-y-2">
            {urls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrls(urls.map((u, idx) => idx === i ? e.target.value : u))}
                  placeholder={i === 0 ? 'https://ejemplo.com/archivo.zip' : ''}
                  className="flex-1 px-3 py-2 bg-surface border border-line rounded-lg text-text placeholder:text-text-muted focus-ring"
                />
                {urls.length > 1 && (
                  <Button variant="ghost" size="sm" type="button" onClick={() => removeUrlField(i)}><X size={16} /></Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" type="button" onClick={addUrlField} className="w-full"><Plus size={16} /> Añadir otra URL</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Carpeta de destino" value={dir} onChange={e => setDir(e.target.value)} placeholder="/downloads" />
          <Select
            label="Consola (opcional)"
            value={consoleId}
            onChange={e => setConsoleId(e.target.value)}
            options={[
              { value: '', label: 'Auto-detectar' },
              { value: 'n64', label: 'Nintendo 64' },
              { value: 'gba', label: 'Game Boy Advance' },
              { value: 'nds', label: 'Nintendo DS' },
              { value: 'n3ds', label: 'Nintendo 3DS' },
              { value: 'snes', label: 'Super Nintendo' },
              { value: 'psx', label: 'PlayStation' },
              { value: 'psp', label: 'PSP' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Conexiones"
            value={connections}
            onChange={e => setConnections(Number(e.target.value))}
            options={[{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 4, label: '4' }, { value: 8, label: '8' }, { value: 16, label: '16' }]}
          />
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={sendToGameHub} onChange={e => setSendToGameHub(e.target.checked)} className="w-4 h-4 accent-accent" />
              <span className="text-sm text-text">Enviar a GameHub tras terminar</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-line flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={closeDialog}>Cancelar</Button>
          <Button variant="primary" type="submit"><Download size={16} /> Añadir {urls.length > 1 ? `${urls.length} descargas` : 'descarga'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
