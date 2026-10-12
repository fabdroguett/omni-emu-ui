import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/Sidebar'
import { Toolbar } from '@/components/Toolbar'
import { useAppStore } from '@/store/useAppStore'
import { Outlet } from 'react-router-dom'

export function AppShell() {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="flex h-full bg-bg">
      <Sidebar />
      <div className={cn('flex-1 flex flex-col overflow-hidden', sidebarCollapsed ? 'lg:pl-14' : 'lg:pl-64')}>
        <Toolbar />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}