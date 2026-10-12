import { StrictMode, useEffect, useMemo, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppStore } from '@/store/useAppStore'
import { setTheme } from '@/lib/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000
    }
  }
})

function ThemedApp(): ReactNode {
  const themeSetting = useAppStore((state) => state.config?.global.theme ?? 'dark')

  const mode = useMemo<'light' | 'dark'>(() => {
    if (themeSetting === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themeSetting
  }, [themeSetting])

  useEffect(() => {
    setTheme(themeSetting)
  }, [themeSetting])

  return (
    <div className={`gamerhub-root ${mode} h-full`} style={{ colorScheme: mode }}>
      {/* The actual pages are rendered via react-router in AppShell */}
    </div>
  )
}

export function GamerHubSection(): ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <ThemedApp />
      </StrictMode>
    </QueryClientProvider>
  )
}