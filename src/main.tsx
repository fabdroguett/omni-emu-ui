import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useStore } from './store/useStore'
import { initTheme } from './lib/theme'

initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// Exposed for automated UI testing / screenshots
;(window as unknown as { __idmStore: typeof useStore }).__idmStore = useStore