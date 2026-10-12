import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './ui/Button'
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-error/15 flex items-center justify-center">
            <AlertTriangle size={32} className="text-error" />
          </div>
          <h2 className="text-xl font-semibold text-text">Algo salió mal</h2>
          <p className="text-text-muted max-w-md">
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={this.handleRetry}><RefreshCw size={16} /> Reintentar</Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>Recargar página</Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-left w-full max-w-2xl mt-4 p-4 bg-surface border border-line rounded-lg">
              <summary className="font-medium text-text cursor-pointer">Detalles del error (desarrollo)</summary>
              <pre className="mt-2 text-xs text-text-muted overflow-auto max-h-64 font-mono">{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}