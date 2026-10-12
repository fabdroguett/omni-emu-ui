import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { cn } from '@/lib/utils'
import { Lock, Eye, EyeOff } from 'lucide-react'

export function PasswordDialog() {
  const { dialog, closeDialog } = useStore()
  if (dialog?.kind !== 'password') return null

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In mock mode, just close
    closeDialog()
  }

  return (
    <Dialog open={true} onOpenChange={closeDialog} title="Contraseña requerida" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-text-muted text-sm">
          {dialog.message || 'Esta descarga requiere una contraseña para descomprimir.'}
        </p>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Introduce la contraseña"
            autoFocus
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={closeDialog}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={!password}>
            <Lock size={16} /> Continuar
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
